const provider = window.env?.CHAT_PROVIDER;
const siteId = window.env?.CHAT_SITE_ID;

if (provider === 'recapchat' && siteId) {
  window.addEventListener('load', () => {
    const s = document.createElement('script');
    s.src = 'https://cdn.recapchat.com/widget.js';
    s.async = true;
    s.onload = () => {
      try {
        window.RecapChat?.init?.({ siteId, open: false });
      } catch (_e) {}
    };
    document.head.appendChild(s);
  });
}
