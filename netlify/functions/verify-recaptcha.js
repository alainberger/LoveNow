import fetch from 'node-fetch';

export async function handler(event) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ success: false, errors: ['missing-secret'] }) };
  }
  let token;
  try {
    ({ token } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, errors: ['invalid-body'] }) };
  }
  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ success: false, errors: ['missing-token'] }) };
  }
  try {
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
    });
    const data = await resp.json();
    const { success = false, score = 0, action = '', ['error-codes']: errors = [] } = data;
    const ok = success && score >= 0.5;
    return { statusCode: ok ? 200 : 400, body: JSON.stringify({ success, score, action, errors }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, errors: [err.message] }) };
  }
}
