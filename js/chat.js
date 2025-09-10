// js/chat.js — charge un widget si configuré (facultatif)
export function loadChat(){
  const provider = (window.env?.CHAT_PROVIDER||'').toLowerCase();
  const siteId   = window.env?.CHAT_SITE_ID;
  if(provider!=='recapchat' || !siteId) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = `https://cdn.recapchat.com/widget.js?id=${encodeURIComponent(siteId)}`;
  s.onload = ()=>console.log('[chat] loaded');
  document.head.appendChild(s);
}