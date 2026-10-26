/* DEBUT — intro film: fits the screen under the sticky header, sound toggle, pauses when off screen,
   and shows the community message over the film once its first play finishes. */
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

  // Community message: once the first play reaches the end (the video loops, so "ended" never fires).
  var msg = document.getElementById("filmMsg"), shown = false;
  function showMsg() {
    if (shown || !msg) return;
    shown = true; msg.hidden = false; sec.classList.add("msg-on");
    if (window.debutMiniWelcome) window.debutMiniWelcome(); // keep น้องเดบู's bubble off the message
  }
  function hideMsg() { if (msg) msg.hidden = true; sec.classList.remove("msg-on"); }
  if (msg) {
    if (reduce) showMsg();
    v.addEventListener("timeupdate", function () { if (v.duration && v.currentTime >= v.duration - 0.35) showMsg(); });
    document.getElementById("filmMsgClose").addEventListener("click", hideMsg);
    document.getElementById("filmReplay").addEventListener("click", function () { hideMsg(); v.currentTime = 0; v.play().catch(function () {}); });
  }

  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) v.play().catch(function () {}); else v.pause(); });
    }, { threshold: 0.2 }).observe(sec);
  }
})();
