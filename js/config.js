/* /js/config.js — configuration publique unique */
window.APP_CONFIG = {
  brand: "LoveNow",
  legal: {
    editorName: "LoveNow (éditeur)",
    editorAddress: "Adresse légale, 75000 Paris, France",
    editorEmail: "contact@lovenow.app"
  },
  dpoEmail: "dpo@lovenow.app",

  firebase: {
    apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
    authDomain: "lovenow-officiel.firebaseapp.com",
    projectId: "lovenow-officiel",
    storageBucket: "lovenow-officiel.firebasestorage.app",
    messagingSenderId: "896585801571",
    appId: "1:896585801571:web:cdde87293291dc1900bd56",
    measurementId: "G-QGM25ND7LF"
  },

  appCheck: { recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD" },

  cloudinary: {
    cloudName: "dyqxadd0j",
    unsignedPreset: "lovenow-direct-upload",
    useSigned: false
  },

  chat: {
    provider: "crisp",
    siteId: "42383cbe-1349-42c2-a0ef-04386b58ccd6"
  },

  analyticsEnabled: false,
  resendCooldown: 30
};

// compat legacy
window.APP_CONFIG.CHAT_PROVIDER = window.APP_CONFIG.chat.provider;
window.APP_CONFIG.CHAT_SITE_ID  = window.APP_CONFIG.chat.siteId;

// event util
window.lovenowReady = function (eventName) {
  window.dispatchEvent(new CustomEvent(eventName));
};

// --- Helpers (idempotent) ---
window.loadCrispIfEnabled = window.loadCrispIfEnabled || function () {
  try {
    var cfg = (window.APP_CONFIG && window.APP_CONFIG.chat) || {};
    if (cfg.provider !== 'crisp' || !cfg.siteId) return;
    if (document.querySelector('script[src="https://client.crisp.chat/l.js"]')) return;
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = cfg.siteId;
    var s = document.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = 1;
    document.head.appendChild(s);
  } catch (e) { console.warn('Crisp load failed', e); }
};

window.loadAppCheck = window.loadAppCheck || function (app) {
  var key = window.APP_CONFIG && window.APP_CONFIG.appCheck && window.APP_CONFIG.appCheck.recaptchaV3SiteKey;
  if (!key) return;
  import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js')
    .then(function (m) {
      m.initializeAppCheck(app, { provider: new m.ReCaptchaV3Provider(key), isTokenAutoRefreshEnabled: true });
    })
    .catch(function (e) { console.error('AppCheck init failed', e); });
};
