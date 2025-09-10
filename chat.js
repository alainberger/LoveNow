(function () {
  var C = window.APP_CONFIG || {};
  if (C.CHAT_PROVIDER === "crisp" && C.CHAT_SITE_ID && !window.CRISP_WEBSITE_ID) {
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = C.CHAT_SITE_ID;
    var s = document.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    document.head.appendChild(s);
  }
})();
