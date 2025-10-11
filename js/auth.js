import { setupFirebase, ensureUserDocuments } from './app-core.js';

const BACKOFF_STORAGE_KEY = 'lovenow:verifyBackoff';
const MAX_BACKOFF_MINUTES = 60 * 24; // cap at 24h

const session = {
  user: null,
  profile: null,
  emailVerified: false,
  contextPromise: null,
  unsubscribeAuth: null,
  unsubscribeProfile: null,
  listeners: new Set(),
};

function getBaseCooldown() {
  const base = Number(window.APP_CONFIG?.resendCooldown);
  return Number.isFinite(base) && base > 0 ? base : 30;
}

function getBackoffState() {
  try {
    const raw = localStorage.getItem(BACKOFF_STORAGE_KEY);
    if (!raw) return { attempts: 0, nextAllowedAt: 0 };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { attempts: 0, nextAllowedAt: 0 };
    return {
      attempts: Number(parsed.attempts) || 0,
      nextAllowedAt: Number(parsed.nextAllowedAt) || 0,
    };
  } catch (err) {
    console.warn('Backoff state read failed', err);
    return { attempts: 0, nextAllowedAt: 0 };
  }
}

function setBackoffState(state) {
  try {
    localStorage.setItem(BACKOFF_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Backoff state write failed', err);
  }
}

function resetBackoff() {
  setBackoffState({ attempts: 0, nextAllowedAt: 0 });
}

function computeNextDelay(attempts) {
  const base = getBaseCooldown();
  const delay = base * Math.pow(2, Math.min(attempts, 6));
  const maxDelay = MAX_BACKOFF_MINUTES * 60;
  return Math.min(delay, maxDelay);
}

async function ensureContext() {
  if (!session.contextPromise) {
    session.contextPromise = setupFirebase();
  }
  return session.contextPromise;
}

function notifyListeners(payload) {
  session.listeners.forEach((listener) => {
    try {
      listener(payload);
    } catch (err) {
      console.error('session listener failed', err);
    }
  });
}

function onProfileSnapshot(snapshot, firestoreModule) {
  const data = snapshot.data() || null;
  session.profile = data;
  const verified = Boolean(data?.emailVerified) && Boolean(session.user?.emailVerified);
  session.emailVerified = verified;
  if (verified) {
    resetBackoff();
  }
  notifyListeners({ user: session.user, profile: session.profile, emailVerified: session.emailVerified });
}

async function syncEmailVerifiedFlag(db, firestoreModule, emailVerified) {
  if (!session.user?.uid) return;
  const { doc, setDoc } = firestoreModule;
  try {
    await setDoc(
      doc(db, 'users', session.user.uid),
      { emailVerified: !!emailVerified, updatedAt: firestoreModule.serverTimestamp() },
      { merge: true },
    );
  } catch (err) {
    console.error('Failed to sync emailVerified flag', err);
  }
}

export async function initAuth(options = {}) {
  const context = await ensureContext();
  const { auth, authModule, firestoreModule, db } = context;
  const {
    requireAuth = false,
    requireVerified = false,
    onAuthenticated,
    onUnauthenticated,
    onVerificationRequired,
  } = options;

  if (session.unsubscribeAuth) {
    session.unsubscribeAuth();
    session.unsubscribeAuth = null;
  }
  if (session.unsubscribeProfile) {
    session.unsubscribeProfile();
    session.unsubscribeProfile = null;
  }

  session.unsubscribeAuth = authModule.onAuthStateChanged(auth, async (user) => {
    session.user = user;
    session.emailVerified = false;
    if (session.unsubscribeProfile) {
      session.unsubscribeProfile();
      session.unsubscribeProfile = null;
    }

    if (user) {
      try {
        await authModule.reload(user);
      } catch (err) {
        console.warn('Reload user failed', err);
      }
      try {
        await ensureUserDocuments(db, firestoreModule, user, { emailVerified: user.emailVerified });
      } catch (err) {
        console.error('ensureUserDocuments failed', err);
      }
      const { doc, onSnapshot } = firestoreModule;
      session.unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        onProfileSnapshot(snapshot, firestoreModule);
        if (requireVerified && !session.emailVerified) {
          onVerificationRequired?.({ user, profile: session.profile });
        }
        onAuthenticated?.({ user, profile: session.profile, emailVerified: session.emailVerified });
      }, (error) => {
        console.error('Profile listener error', error);
      });
    } else {
      session.profile = null;
      if (requireAuth) {
        onUnauthenticated?.();
      }
      onAuthenticated?.({ user: null, profile: null, emailVerified: false });
    }
    notifyListeners({ user: session.user, profile: session.profile, emailVerified: session.emailVerified });
  });

  return context;
}

export function subscribeSession(listener) {
  session.listeners.add(listener);
  if (session.user || session.profile) {
    listener({ user: session.user, profile: session.profile, emailVerified: session.emailVerified });
  }
  return () => session.listeners.delete(listener);
}

export function getCurrentUser() {
  return session.user;
}

export function getCurrentProfile() {
  return session.profile;
}

export function isEmailVerified() {
  return Boolean(session.emailVerified);
}

export function canResendVerification() {
  const state = getBackoffState();
  return Date.now() >= Number(state.nextAllowedAt || 0);
}

export async function resendVerificationEmail() {
  const context = await ensureContext();
  const { auth, authModule, firestoreModule, db } = context;
  if (!auth.currentUser) {
    throw new Error('not-authenticated');
  }
  const state = getBackoffState();
  const now = Date.now();
  if (now < state.nextAllowedAt) {
    const remaining = Math.max(0, Math.ceil((state.nextAllowedAt - now) / 1000));
    const error = new Error('cooldown');
    error.code = 'cooldown';
    error.remaining = remaining;
    throw error;
  }
  await authModule.sendEmailVerification(auth.currentUser);
  const nextDelay = computeNextDelay(state.attempts + 1);
  const nextAllowedAt = now + nextDelay * 1000;
  setBackoffState({ attempts: state.attempts + 1, nextAllowedAt });
  await syncEmailVerifiedFlag(db, firestoreModule, false);
  return { nextAllowedAt };
}

export async function refreshUser() {
  const context = await ensureContext();
  const { auth, authModule, firestoreModule, db } = context;
  if (!auth.currentUser) {
    throw new Error('not-authenticated');
  }
  await authModule.reload(auth.currentUser);
  await syncEmailVerifiedFlag(db, firestoreModule, auth.currentUser.emailVerified);
  return auth.currentUser;
}

export async function signOut() {
  const context = await ensureContext();
  const { auth, authModule } = context;
  await authModule.signOut(auth);
}

export async function signUpWithEmail({ email, password, profile }) {
  const context = await ensureContext();
  const { auth, authModule, firestoreModule, db } = context;
  const { createUserWithEmailAndPassword, updateProfile } = authModule;
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  const user = credentials.user;
  if (profile?.displayName) {
    try {
      await updateProfile(user, { displayName: profile.displayName });
    } catch (err) {
      console.warn('updateProfile failed', err);
    }
  }
  await authModule.sendEmailVerification(user);
  const baseProfile = {
    displayName: profile?.displayName || '',
    name: profile?.displayName || '',
    city: profile?.city || '',
    gender: profile?.gender || '',
    age: profile?.age ?? null,
    bio: profile?.bio || '',
    photoURL: profile?.photoURL || '',
    emailVerified: false,
    filtersDefault: profile?.filtersDefault ?? null,
  };
  await ensureUserDocuments(db, firestoreModule, user, baseProfile);
  await syncEmailVerifiedFlag(db, firestoreModule, false);
  resetBackoff();
  return user;
}

export async function signInWithEmail(email, password) {
  const context = await ensureContext();
  const { auth, authModule } = context;
  const credentials = await authModule.signInWithEmailAndPassword(auth, email, password);
  resetBackoff();
  return credentials.user;
}

export async function gateVerifiedAction(action, { onBlocked } = {}) {
  if (isEmailVerified()) {
    return action();
  }
  if (typeof onBlocked === 'function') {
    onBlocked();
  }
  throw new Error('email-not-verified');
}
