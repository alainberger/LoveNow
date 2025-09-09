// config.js — paramètres appli affichés côté client
// ⚠️ Remplace les infos légales par tes vraies infos (sinon c'est fonctionnel mais pas 100% RGPD)

window.APP_CONFIG = {
  brand: "LoveNow",

  // ——— Identité légale (affichée dans privacy/cgu) ———
  legal: {
    editorName: "LoveNow (éditeur)",
    editorAddress: "Adresse légale à compléter",
    editorEmail: "contact@lovenow.app"
  },
  dpoEmail: "dpo@lovenow.app",

  // ——— TES CLÉS FIREBASE (celles que tu as données) ———
  firebase: {
    apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
    authDomain: "lovenow-officiel.firebaseapp.com",
    projectId: "lovenow-officiel",
    storageBucket: "lovenow-officiel.firebasestorage.app",
    messagingSenderId: "896585801571",
    appId: "1:896585801571:web:cdde87293291dc1900bd56",
    measurementId: "G-QGM25ND7LF"
  },

  // ——— App Check reCAPTCHA v3 (site key côté client uniquement) ———
  appCheck: {
    recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD"
  },

  // Analytics désactivé tant que tu ne gères pas le consentement
  analyticsEnabled: false,

  // cooldown (secondes) pour renvoi e-mail vérif
  resendCooldown: 30
};