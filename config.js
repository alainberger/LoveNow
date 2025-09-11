/* Legacy wrapper — real config lives in /js/config.js */
(function () {
  if (window.APP_CONFIG) return;
  var s = document.createElement('script');
  s.src = '/js/config.js';
  s.async = false;
  document.head.appendChild(s);
})();

