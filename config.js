// config.js — paramètres publics (OK côté client)
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
    useSigned: false // passe à true si on active sign-upload.js côté Netlify
  },
  chat: { provider: "crisp", siteId: "42383cbe-1349-42c2-a0ef-04386b58ccd6" },
  analyticsEnabled: false,
  resendCooldown: 30
};

// compat pour anciens scripts
window.APP_CONFIG.CHAT_PROVIDER = window.APP_CONFIG.chat.provider;
window.APP_CONFIG.CHAT_SITE_ID = window.APP_CONFIG.chat.siteId;

window.lovenowReady = function(eventName){
  window.dispatchEvent(new CustomEvent(eventName));
};
