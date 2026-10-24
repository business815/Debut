/* DEBUT — member registration (free 30-day architect trial) in three places:
   the band under the intro film, a pop-up after the visitor has scrolled through the page,
   and inside the น้องเดบู chat (window.debutSignup.form("chat")). All post to /api/trial. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var KEY = "debut-registered", SEEN = "debut-signup-pop";
  var PROJECTS = ["บ้านพักอาศัย", "รีโนเวต / ตกแต่งภายใน", "โรงแรม / รีสอร์ต", "ร้านค้า / แบรนด์", "เวลเนส / สปา", "อาคารพาณิชย์ / สำนักงาน", "อื่นๆ"];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var seq = 0;
  function get(store, k) { try { return store.getItem(k); } catch (e) { return null; } }
  function set(store, k, v) { try { store.setItem(k, v); } catch (e) {} }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  // Scrolls to the membership details and conditions (the FREE TRIAL section).
  function showTerms(e) {
    if (e) e.preventDefault();
    closePop();
    if (window.debutCloseChat) window.debutCloseChat();
    var t = $("#trial"); if (t) t.scrollIntoView({ behavior: "smooth" });
  }

  function form(kind) {
    var id = "su" + (++seq);
    var f = el("form", "su su--" + kind);
    f.noValidate = true;
    f.innerHTML =
      '<label class="sr" for="' + id + 'n">ชื่อ-นามสกุล หรือชื่อบริษัท</label><input id="' + id + 'n" autocomplete="name" placeholder="ชื่อ-นามสกุล หรือชื่อบริษัท" required>' +
      '<label class="sr" for="' + id + 'e">อีเมล</label><input id="' + id + 'e" type="email" autocomplete="email" placeholder="อีเมล" required>' +
      '<label class="sr" for="' + id + 'p">เบอร์โทร</label><input id="' + id + 'p" type="tel" autocomplete="tel" placeholder="เบอร์โทร">' +
      '<label class="sr" for="' + id + 's">ประเภทโครงการ</label><select id="' + id + 's">' + PROJECTS.map(function (p) { return "<option>" + p + "</option>"; }).join("") + "</select>" +
      '<label class="agree su-agree"><input type="checkbox"> <span>ไม่มีค่าใช้จ่ายใน 30 วันแรก ยกเลิกได้ทุกเมื่อก่อนครบกำหนด</span></label>' +
      '<a class="su-terms" href="#trial">รายละเอียดสิทธิประโยชน์และเงื่อนไขสมาชิก อยู่ด้านล่าง ↓</a>' +
      '<button class="btn primary" type="submit">ลงทะเบียน · ทดลองฟรี 30 วัน</button>' +
      '<p class="trial-msg" role="status" hidden></p>';
    f.querySelector(".su-terms").addEventListener("click", showTerms);
    var btn = f.querySelector("button"), msg = f.querySelector(".trial-msg");
    function say(cls, text) { msg.hidden = false; msg.className = "trial-msg " + cls; msg.textContent = text; }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = { name: f.querySelector("#" + id + "n").value.trim(), email: f.querySelector("#" + id + "e").value.trim(), phone: f.querySelector("#" + id + "p").value.trim(), project: f.querySelector("#" + id + "s").value };
      if (!d.name || !EMAIL.test(d.email)) return say("err", "กรุณากรอกชื่อและอีเมลให้ถูกต้อง");
      if (!f.querySelector(".su-agree input").checked) return say("err", "กรุณายอมรับเงื่อนไขการทดลองใช้ก่อน");
      btn.disabled = true; btn.textContent = "กำลังเตรียมหน้าชำระเงินที่ปลอดภัย…";
      if (window.debutTrack) window.debutTrack("trial");
      fetch("/api/trial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.checkoutUrl) { set(localStorage, KEY, "1"); location.href = j.checkoutUrl; return; }
          if (!j.ok) throw new Error("bad");
          set(localStorage, KEY, "1");
          f.replaceChildren(el("p", "trial-msg ok", "ลงทะเบียนสำเร็จ ทีม DEBUT จะส่งลิงก์ยืนยันบัตรแบบปลอดภัย (Stripe) ไปที่ " + d.email + " เพื่อเริ่มสิทธิ์ทดลองใช้ 30 วัน"));
        })
        .catch(function () { btn.disabled = false; btn.textContent = "ลงทะเบียน · ทดลองฟรี 30 วัน"; say("err", "ส่งข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง"); });
    });
    return f;
  }

  // Band under the intro film
  document.querySelectorAll("[data-signup]").forEach(function (n) { n.appendChild(form(n.getAttribute("data-signup"))); });

  // Pop-up once the visitor has scrolled through the page (footer in view), once per visit
  var pop = null, lastFocus = null;
  function closePop() {
    if (!pop || pop.hidden) return;
    pop.hidden = true; document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openPop() {
    if (get(localStorage, KEY) || get(sessionStorage, SEEN)) return;
    var chat = $("#chat"), films = $("#films");
    if ((chat && !chat.hidden) || (films && !films.hidden)) return;
    set(sessionStorage, SEEN, "1");
    if (!pop) {
      pop = el("div", "su-pop");
      pop.setAttribute("role", "dialog"); pop.setAttribute("aria-modal", "true"); pop.setAttribute("aria-labelledby", "suPopH");
      pop.innerHTML = '<div class="su-pop-box"><button class="ib su-x" type="button" aria-label="ปิด"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<span class="eyebrow">MEMBER REGISTRATION · FREE 30 DAYS</span><h2 id="suPopH">ดูครบแล้ว พร้อมเริ่มโปรเจกต์ของคุณหรือยัง?</h2>' +
        '<p>ลงทะเบียนสมาชิก DEBUT แล้วคุยกับสถาปนิกตัวจริงภายใน 1 วันทำการ ทดลองใช้ฟรี 30 วัน</p></div>';
      pop.querySelector(".su-pop-box").appendChild(form("pop"));
      pop.querySelector(".su-x").addEventListener("click", closePop);
      pop.addEventListener("click", function (e) { if (e.target === pop) closePop(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
      document.body.appendChild(pop);
    }
    lastFocus = document.activeElement;
    pop.hidden = false; document.body.style.overflow = "hidden";
    setTimeout(function () { var i = pop.querySelector("input"); if (i) i.focus(); }, 50);
  }
  var foot = $("footer");
  if (foot && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) setTimeout(openPop, 600);
    }, { threshold: 0.6 });
    io.observe(foot);
  }

  window.debutSignup = { form: form, open: openPop, registered: function () { return !!get(localStorage, KEY); } };
})();
