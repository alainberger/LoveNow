const FEATURES = {
  PAYMENTS_ENABLED: false,
  CREDITS_ENABLED: false,
  REFERRAL_ENABLED: true,
  PWA_ENABLED: true,
  BLOG_ENABLED: true,
  BOOSTS_ENABLED: false
};
if (typeof window !== 'undefined') {
  window.__FEATURES__ = FEATURES;
}
module.exports = { FEATURES };
