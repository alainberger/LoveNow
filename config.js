<script>
  window.APP_CONFIG = {
    brand: "LoveNow",

    // Renseigne ces 3 lignes avec ton identité légale réelle (pour la Privacy)
    legal: {
      editorName: "Ta société / Nom de l’éditeur",
      editorAddress: "Adresse légale complète",
      editorEmail: "contact@ton-domaine.fr"
    },
    dpoEmail: "dpo@ton-domaine.fr",

    // ► TES CLÉS FIREBASE (celles que tu m’as données)
    firebase: {
      apiKey: "AIzaSyB_-cNA8bxqYCYUp3rUZs-VpiP4DX2wn3M",
      authDomain: "lovenow-officiel.firebaseapp.com",
      projectId: "lovenow-officiel",
      storageBucket: "lovenow-officiel.firebasestorage.app",
      messagingSenderId: "896585801571",
      appId: "1:896585801571:web:cdde87293291dc1900bd56",
      measurementId: "G-QGM25ND7LF"
    },

    // ► Firebase App Check (reCAPTCHA v3)
    //    Utilise UNIQUEMENT la site key côté client. NE PAS publier la clé secrète.
    appCheck: {
      recaptchaV3SiteKey: "6LfjpsErAAAAAAExN2IvBq-K475TeJooeNzI9liPD"
    },

    // Analytics désactivé par défaut (mets true après gestion du consentement)
    analyticsEnabled: false,

    // Cooldown (sec) pour renvoi du mail de vérif
    resendCooldown: 30,

    // (Optionnel) Cloudinary — front only : cloudName ok, pas d’API secret côté client
    cloudinary: {
      cloudName: "dyqxadd0j",
      unsignedUploadPreset: "" // si tu en crées un, mets-le ici
    }
  };
</script>
