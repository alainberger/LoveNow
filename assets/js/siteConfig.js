(function(){
  const env = window.__ENV__ || {};
  const fallback = (value, backup) => (value != null && value !== '' ? value : backup);
  const buildDate = (() => {
    const meta = document.querySelector('meta[name="build-date"]');
    if (meta?.content) return meta.content;
    if (typeof document.lastModified === 'string') {
      return document.lastModified;
    }
    return new Date().toISOString();
  })();

  window.SITE_CONFIG = {
    legal: {
      editorName: 'LoveNow',
      editorCompany: 'LoveNow SAS',
      editorAddress: '10 rue des Demoiselles, 75000 Paris, France',
      editorEmail: fallback(env.SUPPORT_EMAIL, 'support@lovenow.app'),
      host: 'Netlify, Inc., 2325 3rd Street, San Francisco, CA 94107, USA',
    },
    dpo: {
      email: fallback(env.DPO_CONTACT_EMAIL, 'dpo@lovenow.app'),
    },
    documents: {
      privacyUpdatedAt: buildDate,
      termsUpdatedAt: buildDate,
      cookiesUpdatedAt: buildDate,
    },
    cookies: {
      analytics: 'Google Analytics (désactivé par défaut)',
      chatProvider: 'Crisp (support utilisateur)',
    },
    transfers: {
      netlify: 'https://www.netlify.com/legal/netlify-dpa',
      firebase: 'https://firebase.google.com/terms/data-processing-terms',
      cloudinary: 'https://cloudinary.com/gdpr',
    },
  };

  window.getSiteConfigValue = function(path, fallbackValue = 'Information disponible prochainement') {
    const parts = Array.isArray(path) ? path : String(path).split('.');
    let current = window.SITE_CONFIG;
    for (const key of parts) {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        current = current[key];
      } else {
        return fallbackValue;
      }
    }
    if (typeof current === 'string' && current.trim() === '') {
      return fallbackValue;
    }
    return current ?? fallbackValue;
  };
})();
