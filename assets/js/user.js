import {
  setupFirebase,
  renderVerifyBanner,
  applySessionToHeader,
  safeSignOut,
  ensureUserDocuments,
  loadUserProfile,
  isDevBypassEnabled,
  getPairId,
} from '/js/app-core.js';

const params = new URLSearchParams(window.location.search);
const targetUid = params.get('uid');

const state = {
  devBypass: isDevBypassEnabled(),
  currentUser: null,
  profile: null,
};

const $ = (selector) => document.querySelector(selector);
const verifyBanner = $('#verifyBanner');
const btnResend = $('#btnResend');
const btnRefresh = $('#btnRefresh');
const headerSlot = $('#header-session');
const devBadge = $('#devBadge');
const photoEl = $('#photo');
const nameEl = $('#name');
const metaEl = $('#meta');
const bioEl = $('#bio');
const feedbackEl = $('#feedback');
const btnMessage = $('#btnMessage');
const btnLike = $('#btnLike');
const emptyState = $('#emptyState');
const profileCard = $('#profileCard');

const setFeedback = (message, tone = 'info') => {
  if (!feedbackEl) return;
  feedbackEl.textContent = message;
  feedbackEl.dataset.tone = tone;
};

const renderProfile = (profile) => {
  if (!profile) {
    if (profileCard) profileCard.hidden = true;
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (profileCard) profileCard.hidden = false;
  if (emptyState) emptyState.hidden = true;
  if (photoEl) {
    photoEl.src = profile.photoURL || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=600&auto=format&fit=crop';
    photoEl.alt = `Photo de ${profile.name || profile.displayName || 'profil'}`;
  }
  if (nameEl) nameEl.textContent = profile.name || profile.displayName || 'Utilisateur';
  if (metaEl) {
    const pieces = [];
    if (profile.age != null) pieces.push(`${profile.age} ans`);
    if (profile.city) pieces.push(profile.city);
    if (profile.gender) pieces.push(profile.gender);
    metaEl.textContent = pieces.join(' · ') || 'Profil incomplet';
  }
  if (bioEl) bioEl.textContent = profile.bio || 'Ce membre n’a pas encore rédigé sa présentation.';
};

const showDevBadge = () => {
  if (devBadge) devBadge.hidden = !state.devBypass;
};

const ensureLike = async (db, firestoreModule, targetUid) => {
  if (!state.currentUser) return false;
  const { doc, setDoc, getDoc, serverTimestamp } = firestoreModule;
  const likeRef = doc(db, 'likes', state.currentUser.uid, 'sent', targetUid);
  await setDoc(likeRef, { createdAt: serverTimestamp() }, { merge: true });
  const reciprocalRef = doc(db, 'likes', targetUid, 'sent', state.currentUser.uid);
  const reciprocalSnap = await getDoc(reciprocalRef);
  if (reciprocalSnap.exists()) {
    const pairId = getPairId(state.currentUser.uid, targetUid);
    const matchRef = doc(db, 'matches', pairId);
    await setDoc(matchRef, {
      members: [state.currentUser.uid, targetUid],
      createdAt: serverTimestamp(),
    }, { merge: true });
    return true;
  }
  return false;
};

const redirectToLogin = () => {
  window.location.href = '/login.html#log_in';
};

if (!targetUid) {
  renderProfile(null);
} else {
  (async () => {
    const { auth, db, authModule, firestoreModule } = await setupFirebase();
    const {
      onAuthStateChanged,
      signOut,
      sendEmailVerification,
      reload,
    } = authModule;

    renderVerifyBanner({
      banner: verifyBanner,
      resendBtn: btnResend,
      refreshBtn: btnRefresh,
      onResend: async () => {
        if (!auth.currentUser) return;
        await sendEmailVerification(auth.currentUser);
        setFeedback('Lien de vérification envoyé ✅', 'success');
      },
      onRefresh: async () => {
        if (!auth.currentUser) return;
        await reload(auth.currentUser);
        if (auth.currentUser.emailVerified || state.devBypass) {
          verifyBanner.hidden = true;
        }
      },
    });

    showDevBadge();

    const profile = await loadUserProfile(db, firestoreModule, targetUid);
    renderProfile(profile);

    onAuthStateChanged(auth, async (user) => {
      state.currentUser = user;
      if (user) {
        applySessionToHeader(headerSlot, user, {
          onSignOutClick: (event) => safeSignOut(auth, signOut, event?.currentTarget),
        });
        await ensureUserDocuments(db, firestoreModule, user);
        verifyBanner.hidden = user.emailVerified || state.devBypass;
      } else {
        applySessionToHeader(headerSlot, null, { onSignOutClick: () => {} });
        verifyBanner.hidden = true;
      }
    });

    btnMessage?.addEventListener('click', () => {
      if (!targetUid) return;
      if (!state.currentUser) {
        redirectToLogin();
        return;
      }
      if (!state.currentUser.emailVerified && !state.devBypass) {
        verifyBanner.hidden = false;
        setFeedback('Vérifie ton e-mail pour envoyer un message.', 'warn');
        return;
      }
      window.location.href = `/conversations.html?startWith=${encodeURIComponent(targetUid)}`;
    });

    btnLike?.addEventListener('click', async () => {
      if (!targetUid) return;
      if (!state.currentUser) {
        redirectToLogin();
        return;
      }
      if (!state.currentUser.emailVerified && !state.devBypass) {
        verifyBanner.hidden = false;
        setFeedback('Vérifie ton e-mail pour aimer des profils.', 'warn');
        return;
      }
      try {
        const match = await ensureLike(db, firestoreModule, targetUid);
        setFeedback(match ? 'C’est un match 🎉 !' : 'Like envoyé ✅', match ? 'success' : 'info');
        if (match) {
          btnMessage?.focus();
        }
      } catch (error) {
        console.error('like profile failed', error);
        setFeedback('Impossible d’aimer ce profil pour le moment.', 'error');
      }
    });
  })();
}
