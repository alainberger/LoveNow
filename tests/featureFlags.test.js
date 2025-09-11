const assert = require('assert');
const { FEATURES } = require('../js/features.js');

assert.strictEqual(FEATURES.PAYMENTS_ENABLED, false);
assert.strictEqual(FEATURES.CREDITS_ENABLED, false);
assert.strictEqual(FEATURES.REFERRAL_ENABLED, true);
assert.strictEqual(FEATURES.PWA_ENABLED, true);
assert.strictEqual(FEATURES.BLOG_ENABLED, true);
assert.strictEqual(FEATURES.BOOSTS_ENABLED, false);

console.log('Feature flags OK');
