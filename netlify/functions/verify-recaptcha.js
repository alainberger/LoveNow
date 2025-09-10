/**
 * Netlify Function: verify-recaptcha
 * Valide un token reCAPTCHA via l’API Google.
 * Requiert la variable d’environnement Netlify: RECAPTCHA_SECRET.
 * Répond en JSON. CORS permissif.
 */
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      return { statusCode: 500, headers, body: JSON.stringify({ success:false, error:'missing-secret' }) };
    }

    let token;
    try {
      ({ token } = JSON.parse(event.body || '{}'));
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ success:false, error:'invalid-json' }) };
    }
    if (!token) {
      return { statusCode: 400, headers, body: JSON.stringify({ success:false, error:'missing-token' }) };
    }

    const params = new URLSearchParams({ secret, response: token });
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params
    });
    const data = await resp.json();

    const ok = !!data.success && (data.score === undefined || data.score >= 0.5);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: ok,
        score: data.score,
        action: data.action,
        errors: data['error-codes'] || []
      })
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ success:false, error:String(e) }) };
  }
};
