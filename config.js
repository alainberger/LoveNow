// config.js — paramètres publics (OK côté client)
window.APP_CONFIG = {
  brand: "LoveNow",

  legal: {
    editorName: "LoveNow (éditeur)",
    editorAddress: "Adresse légale, 75000 Paris, France",
    editorEmail: "contact@lovenow.app"
  },
  dpoEmail: "dpo@lovenow.app",

  // Firebase (tes clés publiques)
  firebase: {
    apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
    authDomain: "lovenow-officiel.firebaseapp.com",
    projectId: "lovenow-officiel",
    storageBucket: "lovenow-officiel.firebasestorage.app",
    messagingSenderId: "896585801571",
    appId: "1:896585801571:web:cdde87293291dc1900bd56",
    measurementId: "G-QGM25ND7LF"
  },

  // App Check (site-key seulement)
  appCheck: { recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD" },

  // Cloudinary (client — aucun secret ici)
  cloudinary: {
    cloudName: "dyqxadd0j",
    unsignedPreset: "lovenow-direct-upload"
  },

  analyticsEnabled: false,
  resendCooldown: 30
};

window.env = window.env || {};
window.env.RECAPTCHA_SITE_KEY = "6LfjpsErAAAAAExN2IvBq-K475TeJooeNzl9liPD";
