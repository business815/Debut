/* DEBUT — counts one page view per page load for the visitor numbers in /admin (random browser id, no personal data). */
(function () {
  var vid;
  try {
    vid = localStorage.getItem("debut-vid");
    if (!vid) { vid = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toLowerCase(); localStorage.setItem("debut-vid", vid); }
  } catch (e) { vid = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toLowerCase(); }
  try {
    fetch("/api/visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vid: vid, page: location.pathname }), keepalive: true }).catch(function () {});
  } catch (e) {}
})();
