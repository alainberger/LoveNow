(function(){
  const env = window.__ENV__ || {};
  const fallback = (value, backup = '') => (value != null && value !== '' ? value : backup);
  const supportEmail = fallback(env.SUPPORT_EMAIL, 'support@lovenow.app');
  const dpoEmail = fallback(env.DPO_CONTACT_EMAIL, 'dpo@lovenow.app');

  const firebaseConfig = {
    apiKey: fallback(env.FIREBASE_API_KEY),
    authDomain: fallback(env.FIREBASE_AUTH_DOMAIN),
    projectId: fallback(env.FIREBASE_PROJECT_ID),
    appId: fallback(env.FIREBASE_APP_ID),
    measurementId: fallback(env.FIREBASE_MEASUREMENT_ID),
  };

  const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => typeof value === 'string' && value.length > 0);
  if (!hasFirebaseConfig) {
    console.warn('[LoveNow] Firebase config incomplete. Configure env vars or /public/env.js.');
  }

  window.APP_CONFIG = {
    brand: 'LoveNow',
    legal: {
      editorName: 'LoveNow (éditeur)',
      editorAddress: 'Adresse légale, 75000 Paris, France',
      editorEmail: supportEmail,
    },
    dpoEmail,
    supportEmail,
    firebase: firebaseConfig,
    appCheck: { recaptchaV3SiteKey: fallback(env.RECAPTCHA_V3_SITE_KEY) },
    cloudinary: {
      cloudName: fallback(env.CLOUDINARY_CLOUD_NAME),
      unsignedPreset: fallback(env.CLOUDINARY_UPLOAD_PRESET),
      useSigned: false,
    },
    chat: { provider: 'crisp', siteId: '42383cbe-1349-42c2-a0ef-04386b58ccd6' },
    analyticsEnabled: false,
    resendCooldown: 30,
    featureFlags: {
      notifications: String(env.NOTIFS_ENABLED) === '1',
    },
  };

  window.APP_CONFIG.CHAT_PROVIDER = window.APP_CONFIG.chat.provider;
  window.APP_CONFIG.CHAT_SITE_ID = window.APP_CONFIG.chat.siteId;

  window.lovenowReady = function(eventName){
    window.dispatchEvent(new CustomEvent(eventName));
  };

  window.loadCrispIfEnabled = function(){
    if(window.APP_CONFIG?.chat?.provider==='crisp' && window.APP_CONFIG?.chat?.siteId){
      window.$crisp = window.$crisp || [];
      window.CRISP_WEBSITE_ID = window.APP_CONFIG.chat.siteId;
      const s=document.createElement('script');
      s.src='https://client.crisp.chat/l.js';
      s.async=1;
      document.head.appendChild(s);
    }
  };

  window.loadAppCheck = function(app){
    const key = window.APP_CONFIG?.appCheck?.recaptchaV3SiteKey;
    if(!key) return;
    import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js')
      .then(({initializeAppCheck, ReCaptchaV3Provider})=>{
        initializeAppCheck(app,{provider:new ReCaptchaV3Provider(key), isTokenAutoRefreshEnabled:true});
      })
      .catch(err=>console.error('AppCheck init failed',err));
  };
})();
