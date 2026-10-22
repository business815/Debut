(function () {
  if (window.__debutBootDone) return; window.__debutBootDone = 1;
  ["/assets/projects.js", "/assets/community.js", "/assets/showcase.js"].forEach(function (src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement("script"); s.src = src; s.async = false; document.body.appendChild(s);
  });
})();
