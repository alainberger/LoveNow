// js/recaptcha.js — No-op si pas de clé site (pas d'erreur)
let ready = false;
function load(siteKey){
  return new Promise(res=>{
    if(ready) return res();
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.onload = ()=>{ ready = true; res(); };
    s.onerror = ()=>{ console.warn('[reCAPTCHA] chargement impossible'); res(); };
    document.head.appendChild(s);
  });
}
export async function getRecaptchaToken(action='submit'){
  const key = window.env?.RECAPTCHA_SITE_KEY;
  if(!key) return null;
  await load(key);
  if(!window.grecaptcha?.execute) return null;
  try{ return await window.grecaptcha.execute(key, { action }); }
  catch{ return null; }
}