/* DEBUT — intro film: fits the screen under the sticky header, sound toggle, pauses when off screen. */
(function () {
  "use strict";
  var sec = document.getElementById("film"), v = document.getElementById("introVideo"), btn = document.getElementById("introSound");
  if (!sec || !v) return;
  var top = document.querySelector(".top");
  function fit() { if (top) document.documentElement.style.setProperty("--top-h", top.offsetHeight + "px"); }
  fit(); window.addEventListener("resize", fit); window.addEventListener("load", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { v.removeAttribute("autoplay"); v.pause(); v.controls = true; }

  btn.addEventListener("click", function () {
    var on = v.muted;
    v.muted = !on;
    if (on) { v.currentTime = 0; v.play().catch(function () {}); }
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? "ปิดเสียงวิดีโอ" : "เปิดเสียงวิดีโอ");
    btn.querySelector("span").textContent = on ? "ปิดเสียง" : "เปิดเสียง";
  });

  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) v.play().catch(function () {}); else v.pause(); });
    }, { threshold: 0.2 }).observe(sec);
  }
})();
