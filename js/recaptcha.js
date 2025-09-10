const SITE_KEY = window.env?.RECAPTCHA_SITE_KEY;
let loading;

export async function getRecaptchaToken(action){
  if(!SITE_KEY) return null;
  await load();
  try{
    return await grecaptcha.execute(SITE_KEY, { action });
  }catch(e){
    return null;
  }
}

function load(){
  if(loading) return loading;
  loading = new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
  return loading;
}
