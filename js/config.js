<script>
// config.js — paramètres publics (OK côté client)
window.APP_CONFIG = {
  brand: "LoveNow",

  legal: {
    editorName: "LoveNow (éditeur)",
    editorAddress: "Adresse légale, 75000 Paris, France",
    editorEmail: "contact@lovenow.app"
  },
  dpoEmail: "dpo@lovenow.app",

  // === Firebase (clés publiques) ===
  firebase: {
    apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
    authDomain: "lovenow-officiel.firebaseapp.com",
    projectId: "lovenow-officiel",
    storageBucket: "lovenow-officiel.firebasestorage.app",
    messagingSenderId: "896585801571",
    appId: "1:896585801571:web:cdde87293291dc1900bd56",
    measurementId: "G-QGM25ND7LF"
  },

  // App Check (site-key uniquement)
  appCheck: { recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD" },

  // === Cloudinary (client — aucun secret ici) ===
  // Pour l’instant on reste en upload "unsigned" (preset requis côté Cloudinary)
  cloudinary: {
    cloudName: "dyqxadd0j",
    unsignedPreset: "lovenow-direct-upload",
    useSigned: false         // ← mets true seulement quand la fonction Netlify de signature sera en place
  },

  // Chat (Crisp)
  chat: {
    provider: "crisp",
    siteId: "42383cbe-1349-42c2-a0ef-04386b58ccd6"
  },

  analyticsEnabled: false,
  resendCooldown: 30
};

// Nettoyage : on ne duplique PAS la clé AppCheck ici (et on évite les typos).
</script>