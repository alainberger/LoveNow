// config.js — paramètres publics (OK côté client)
window.APP_CONFIG = {
  brand: "LoveNow",

  // Identité légale (affichée dans privacy/cgu) — à ajuster si besoin
  legal: {
    editorName: "LoveNow (éditeur)",
    editorAddress: "Adresse légale, 75000 Paris, France",
    editorEmail: "contact@lovenow.app"
  },
  dpoEmail: "dpo@lovenow.app",

  // >>> TES CLÉS FIREBASE (celles que tu m’as données) <<<
  firebase: {
    apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
    authDomain: "lovenow-officiel.firebaseapp.com",
    projectId: "lovenow-officiel",
    storageBucket: "lovenow-officiel.firebasestorage.app",
    messagingSenderId: "896585801571",
    appId: "1:896585801571:web:cdde87293291dc1900bd56",
    measurementId: "G-QGM25ND7LF"
  },

  // App Check reCAPTCHA v3 — SEULEMENT la site-key côté client
  appCheck: { recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD" },

  analyticsEnabled: false,          // laisser false tant que pas de CMP
  resendCooldown: 30                // cooldown renvoi e-mail (s)
};