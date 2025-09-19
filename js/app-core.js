/**
 * app-core.js
 * Centralise l'initialisation Firebase et expose des helpers communs
 * (authentification, profils, mode test, etc.) pour l'ensemble du site.
 */

const FIREBASE_VERSION = '10.12.5';
const BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/`;
const DEV_BYPASS_KEY = 'dev:allowUnverified';
const THEME_KEY = 'theme';

const appPromise = (async () => {
  if (!window.APP_CONFIG?.firebase) {
    throw new Error('Firebase config manquante (config.js)');
  }
  const { initializeApp, getApps, getApp } = await import(`${BASE}firebase-app.js`);
  const app = getApps().length ? getApp() : initializeApp(window.APP_CONFIG.firebase);
  try {
    if (typeof window.loadAppCheck === 'function') {
      window.loadAppCheck(app);
    }
  } catch (err) {
    console.warn('AppCheck init error', err);
  }
  return app;
})();

const authModulePromise = import(`${BASE}firebase-auth.js`);
const firestoreModulePromise = import(`${BASE}firebase-firestore.js`);

let firebaseContext = null;

export async function setupFirebase() {
  if (firebaseContext) return firebaseContext;
  const [app, authModule, firestoreModule] = await Promise.all([
    appPromise,
    authModulePromise,
    firestoreModulePromise,
  ]);
  const auth = authModule.getAuth(app);
  const db = firestoreModule.getFirestore(app);
  firebaseContext = { app, auth, authModule, firestoreModule, db };
  return firebaseContext;
}

export function redirectToLogin() {
  window.location.href = '/login.html#log_in';
}

export function isDevBypassEnabled() {
  try {
    return localStorage.getItem(DEV_BYPASS_KEY) === 'true';
  } catch {
    return false;
  }
}

export function formatDisplayName(userDoc = {}, authUser = {}) {
  return userDoc.name || userDoc.displayName || authUser.displayName || authUser.email || 'Utilisateur';
}

export function getThemePreference() {
  try {
    return localStorage.getItem(THEME_KEY) || null;
  } catch {
    return null;
  }
}

export function setThemePreference(value) {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    /* no-op */
  }
}

export function getDevBadgeTemplate() {
  return `<span class="badge badge--dev" title="Mode test actif">Mode test</span>`;
}

export function getPairId(uidA, uidB) {
  return [uidA, uidB].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join('_');
}

export function buildUserProfilePayload(user, overrides = {}) {
  const { serverTimestamp } = overrides.firestoreModule || {};
  const baseCity = overrides.city || user.city || '';
  const cityLower = baseCity ? baseCity.trim().toLowerCase() : '';
  const payload = {
    uid: user.uid,
    email: user.email || '',
    emailVerified: !!user.emailVerified,
    name: overrides.name ?? user.displayName ?? '',
    displayName: overrides.name ?? user.displayName ?? '',
    age: typeof overrides.age === 'number' ? overrides.age : user.age ?? null,
    city: overrides.city ?? user.city ?? '',
    cityLower,
    gender: overrides.gender ?? user.gender ?? '',
    bio: overrides.bio ?? user.bio ?? '',
    photoURL: overrides.photoURL ?? user.photoURL ?? '',
    updatedAt: serverTimestamp ? serverTimestamp() : null,
  };
  if (serverTimestamp) {
    payload.updatedAt = serverTimestamp();
    if (!overrides.createdAt) {
      payload.createdAt = serverTimestamp();
    }
  }
  return payload;
}

export async function ensureUserDocuments(db, firestoreModule, user, extra = {}) {
  const { doc, getDoc, setDoc, serverTimestamp } = firestoreModule;
  const profileRef = doc(db, 'users', user.uid);
  const snap = await getDoc(profileRef);
  const payload = {
    uid: user.uid,
    email: user.email || '',
    emailVerified: !!user.emailVerified,
    name: user.displayName || user.email || '',
    displayName: user.displayName || user.email || '',
    age: null,
    gender: '',
    city: '',
    cityLower: '',
    bio: '',
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...extra,
  };
  if (!snap.exists()) {
    await setDoc(profileRef, payload, { merge: true });
  }
  // Backward compat: miroir dans "profiles"
  const legacyRef = doc(db, 'profiles', user.uid);
  const legacySnap = await getDoc(legacyRef);
  if (!legacySnap.exists()) {
    await setDoc(legacyRef, payload, { merge: true });
  }
  return profileRef;
}

export async function loadUserProfile(db, firestoreModule, uid) {
  const { doc, getDoc } = firestoreModule;
  const ref = doc(db, 'users', uid);
  let snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  const legacyRef = doc(db, 'profiles', uid);
  snap = await getDoc(legacyRef);
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(db, firestoreModule, uid, data) {
  const { doc, setDoc, serverTimestamp } = firestoreModule;
  const payload = { ...data, updatedAt: serverTimestamp(), cityLower: data.city ? data.city.trim().toLowerCase() : '' };
  await Promise.all([
    setDoc(doc(db, 'users', uid), payload, { merge: true }),
    setDoc(doc(db, 'profiles', uid), payload, { merge: true }),
  ]);
}

export async function updateUserPreferences(db, firestoreModule, uid, prefs) {
  const { doc, setDoc, serverTimestamp } = firestoreModule;
  return setDoc(doc(db, 'users', uid, 'preferences', 'default'), {
    ...prefs,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserPreferences(db, firestoreModule, uid) {
  const { doc, getDoc } = firestoreModule;
  const snap = await getDoc(doc(db, 'users', uid, 'preferences', 'default'));
  return snap.exists() ? snap.data() : {};
}

export function renderVerifyBanner({ banner, resendBtn, refreshBtn, onResend, onRefresh, devBadgeSlot }) {
  if (!banner) return;
  if (isDevBypassEnabled()) {
    banner.innerHTML += devBadgeSlot ? devBadgeSlot : getDevBadgeTemplate();
  }
  resendBtn?.addEventListener('click', async () => {
    resendBtn.disabled = true;
    try {
      await onResend?.();
      banner.classList.add('banner--success');
      setTimeout(() => banner.classList.remove('banner--success'), 1800);
    } catch (err) {
      console.error('sendEmailVerification failed', err);
      banner.classList.add('banner--error');
      setTimeout(() => banner.classList.remove('banner--error'), 1800);
    } finally {
      resendBtn.disabled = false;
    }
  });
  refreshBtn?.addEventListener('click', async () => {
    refreshBtn.disabled = true;
    try {
      await onRefresh?.();
    } finally {
      refreshBtn.disabled = false;
    }
  });
}

export async function safeSignOut(auth, signOutFn, button) {
  if (!button) {
    await signOutFn(auth);
    redirectToLogin();
    return;
  }
  button.disabled = true;
  try {
    await signOutFn(auth);
  } finally {
    redirectToLogin();
  }
}

export function applySessionToHeader(slot, user, { onSignOutClick }) {
  if (!slot) return;
  if (user) {
    const initial = (user.displayName || user.email || '?').slice(0, 1).toUpperCase();
    slot.innerHTML = `
      <a class="btn ghost" href="/profile.html" aria-label="Accéder à mon profil">${initial}</a>
      <button type="button" class="btn ghost" id="headerSignOut">Se déconnecter</button>
    `;
    slot.querySelector('#headerSignOut')?.addEventListener('click', onSignOutClick);
  } else {
    slot.innerHTML = '<a class="btn" href="/login.html#signup">Rejoins-nous gratuitement</a>';
  }
}

export function bool(value) {
  return value === true || value === 'true';
}

export const constants = {
  FIREBASE_VERSION,
  DEV_BYPASS_KEY,
  THEME_KEY,
};
