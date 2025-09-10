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

// Charge Crisp si activé dans la config
window.loadCrispIfEnabled = function(){
  if(window.APP_CONFIG?.chat?.provider==='crisp' && window.APP_CONFIG?.chat?.siteId){
    if(document.querySelector('script[src="https://client.crisp.chat/l.js"]')) return; // évite doublon
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = window.APP_CONFIG.chat.siteId;
    const s=document.createElement('script');
    s.src='https://client.crisp.chat/l.js';
    s.async=1;
    document.head.appendChild(s);
  }
};

// Installe App Check reCAPTCHA v3 si la clé est fournie
window.loadAppCheck = function(app){
  const key = window.APP_CONFIG?.appCheck?.recaptchaV3SiteKey;
  if(!key) return;
  import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js')
    .then(({initializeAppCheck, ReCaptchaV3Provider})=>{
      initializeAppCheck(app,{provider:new ReCaptchaV3Provider(key), isTokenAutoRefreshEnabled:true});
    })
    .catch(err=>console.error('AppCheck init failed',err));
};
