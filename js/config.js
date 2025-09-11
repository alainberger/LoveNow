// config.js — paramètres publics (OK côté client)
window.APP_CONFIG = {
  brand: "LoveNow",

  legal: {
    editorName: "LoveNow (éditeur)",
    editorAddress: "Adresse légale, 75000 Paris, France",
    editorEmail: "contact@lovenow.app"
  },
  dpoEmail: "dpo@lovenow.app",

  // Firebase (clés publiques)
  firebase: {
    apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
    authDomain: "lovenow-officiel.firebaseapp.com",
    projectId: "lovenow-officiel",
    storageBucket: "lovenow-officiel.firebasestorage.app",
    messagingSenderId: "896585801571",
    appId: "1:896585801571:web:cdde87293291dc1900bd56",
    measurementId: "G-QGM25ND7LF"
  },

  // App Check (site key uniquement)
  appCheck: { recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD" },

  // Cloudinary (client — aucun secret ici)
  cloudinary: {
    cloudName: "dyqxadd0j",
    unsignedPreset: "lovenow-direct-upload",
    // passe à true si tu actives la fonction Netlify sign-upload.js
    useSigned: false
  },

  // Chat
  chat: { provider: "crisp", siteId: "42383cbe-1349-42c2-a0ef-04386b58ccd6" },

  analyticsEnabled: false,
  resendCooldown: 30
};

// Compat pour anciens scripts
window.APP_CONFIG.CHAT_PROVIDER = window.APP_CONFIG.chat.provider;
window.APP_CONFIG.CHAT_SITE_ID  = window.APP_CONFIG.chat.siteId;

// Petit helper
window.lovenowReady = function(eventName){
  window.dispatchEvent(new CustomEvent(eventName));
};

// Charge Crisp si activé dans la config (sans doublon)
window.loadCrispIfEnabled = function(){
  const cfg = window.APP_CONFIG?.chat;
  if (!(cfg && cfg.provider === 'crisp' && cfg.siteId)) return;

  // déjà injecté ? on sort
  if (document.querySelector('script[src="https://client.crisp.chat/l.js"]')) return;

  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = cfg.siteId;

  const s = document.createElement('script');
  s.src   = 'https://client.crisp.chat/l.js';
  s.async = true;
  document.head.appendChild(s);
};

// Installe App Check reCAPTCHA v3 si la clé est fournie
window.loadAppCheck = function(app){
  const key = window.APP_CONFIG?.appCheck?.recaptchaV3SiteKey;
  if(!key) return;
  import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js')
    .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
      initializeAppCheck(app, { provider: new ReCaptchaV3Provider(key), isTokenAutoRefreshEnabled: true });
    })
    .catch(err => console.error('AppCheck init failed', err));
};