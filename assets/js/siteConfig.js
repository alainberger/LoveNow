/**
 * siteConfig.js — Configuration publique des mentions légales & documents.
 * Aucun secret ne doit être ajouté ici.
 */
window.SITE_CONFIG = {
  legal: {
    editorName: 'LoveNow',
    editorCompany: 'LoveNow SAS',
    editorAddress: '10 rue des Demoiselles, 75000 Paris, France',
    editorEmail: 'contact@lovenow.app',
    host: 'Netlify, Inc., 2325 3rd Street, San Francisco, CA 94107, USA',
  },
  dpo: {
    email: 'dpo@lovenow.app',
  },
  documents: {
    privacyUpdatedAt: '15 mai 2024',
    termsUpdatedAt: '15 mai 2024',
    cookiesUpdatedAt: '15 mai 2024',
  },
  cookies: {
    analytics: 'Google Analytics (désactivé par défaut)',
    chatProvider: 'Crisp (support utilisateur)',
  },
  transfers: {
    netlify: 'https://www.netlify.com/privacy/',
    firebase: 'https://firebase.google.com/support/privacy',
    cloudinary: 'https://cloudinary.com/privacy',
  },
};

window.getSiteConfigValue = function(path, fallback = 'Information disponible prochainement') {
  const parts = Array.isArray(path) ? path : String(path).split('.');
  let current = window.SITE_CONFIG;
  for (const key of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      return fallback;
    }
  }
  if (typeof current === 'string' && current.trim() === '') {
    return fallback;
  }
  return current ?? fallback;
};
