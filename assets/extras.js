/* DEBUT — art-toy mascot welcome, DEBUT FILMS pop-up, free-trial form */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  var TOY = '<svg class="toy" viewBox="0 0 200 240" aria-hidden="true">' +
    '<defs><radialGradient id="tgHead" cx="35%" cy="28%" r="78%"><stop offset="0" stop-color="#FFEFA8"/><stop offset=".5" stop-color="#F6C945"/><stop offset="1" stop-color="#D99E1C"/></radialGradient>' +
    '<radialGradient id="tgBody" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#6576FF"/><stop offset="1" stop-color="#1B2BA8"/></radialGradient>' +
    '<radialGradient id="tgEye" cx="40%" cy="32%" r="72%"><stop offset="0" stop-color="#4A5AA8"/><stop offset="1" stop-color="#0B0F2A"/></radialGradient></defs>' +
    '<ellipse cx="100" cy="231" rx="46" ry="7" fill="#000" opacity=".14"/>' +
    '<g class="toy-all">' +
    '<rect x="76" y="194" width="20" height="30" rx="10" fill="#F4F4F2" stroke="#111" stroke-width="3"/><rect x="104" y="194" width="20" height="30" rx="10" fill="#F4F4F2" stroke="#111" stroke-width="3"/>' +
    '<rect x="46" y="154" width="20" height="40" rx="10" fill="url(#tgBody)" stroke="#111" stroke-width="3" transform="rotate(16 56 158)"/>' +
    '<rect x="62" y="148" width="76" height="62" rx="28" fill="url(#tgBody)" stroke="#111" stroke-width="3"/>' +
    '<circle cx="100" cy="182" r="9" fill="#F2B705" stroke="#111" stroke-width="2"/><path d="M100 173a9 9 0 0 1 0 18z" fill="#D93A26"/>' +
    '<g class="toy-arm"><rect x="134" y="128" width="20" height="44" rx="10" fill="url(#tgBody)" stroke="#111" stroke-width="3"/><circle cx="144" cy="126" r="10" fill="#FFE9D6" stroke="#111" stroke-width="3"/></g>' +
    '<g class="toy-head">' +
    '<rect x="134" y="24" width="18" height="34" rx="4" fill="#2438D6" stroke="#111" stroke-width="3"/>' +
    '<path d="M100 14Q108 14 114 19L178 72Q186 79 186 90V138Q186 162 162 162H38Q14 162 14 138V90Q14 79 22 72L86 19Q92 14 100 14Z" fill="url(#tgHead)" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M62 60a14 14 0 0 1 28 0z" fill="#D93A26" stroke="#111" stroke-width="3"/>' +
    '<ellipse cx="58" cy="84" rx="22" ry="9" fill="#fff" opacity=".5" transform="rotate(-32 58 84)"/>' +
    '<g class="toy-eyes"><ellipse cx="70" cy="110" rx="17" ry="20" fill="url(#tgEye)" stroke="#111" stroke-width="2"/><ellipse cx="130" cy="110" rx="17" ry="20" fill="url(#tgEye)" stroke="#111" stroke-width="2"/>' +
    '<circle cx="64" cy="102" r="6.5" fill="#fff"/><circle cx="124" cy="102" r="6.5" fill="#fff"/><circle cx="76" cy="119" r="3" fill="#fff"/><circle cx="136" cy="119" r="3" fill="#fff"/></g>' +
    '<ellipse cx="46" cy="134" rx="11" ry="6" fill="#F49AA0" opacity=".9"/><ellipse cx="154" cy="134" rx="11" ry="6" fill="#F49AA0" opacity=".9"/>' +
    '<path class="toy-mouth" d="M91 136Q100 147 109 136Q100 140 91 136Z" fill="#9E3434" stroke="#111" stroke-width="2" stroke-linejoin="round"/>' +
    "</g></g></svg>";
  document.querySelectorAll("[data-toy]").forEach(function (n, i) { n.innerHTML = TOY.replace(/tg(Head|Body|Eye)/g, "tg$1" + i); });

  var WELCOME = "สวัสดีครับ! ผมน้องเดบู ยินดีต้อนรับสู่โลกแห่งการออกแบบของ DEBUT ที่ไอเดียของคุณจะกลายเป็นอาคารจริง ด้วย AI และสถาปนิกตัวจริงครับ";
  var toys = function () { return document.querySelectorAll(".toy"); };
  function talking(on) { toys().forEach(function (t) { t.classList.toggle("talk", on); }); }
  function typeOut(node, text) {
    if (!node) return;
    var i = 0; node.textContent = "";
    clearInterval(node._t);
    node._t = setInterval(function () { i += 2; node.textContent = text.slice(0, i); if (i >= text.length) clearInterval(node._t); }, 28);
  }
  /* Cute cartoon-style voice: English line first, then Thai. Browsers only allow speech
     after the visitor has interacted with the page, so if the first try is blocked we
     speak on the visitor's first tap / click / key press. */
  var WELCOME_EN = "Welcome to the world of design!";
  var spokenOnce = false, pendingVoice = false;
  function pickVoice(list, re, prefer) {
    var m = list.filter(function (v) { return re.test(v.lang); });
    for (var i = 0; i < prefer.length; i++) { var hit = m.filter(function (v) { return prefer[i].test(v.name); })[0]; if (hit) return hit; }
    return m[0] || null;
  }
  function utter(text, lang, voice, pitch, rate) {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.pitch = pitch; u.rate = rate; u.volume = 1;
    if (voice) u.voice = voice;
    return u;
  }
  function speakWelcome(fromGesture) {
    typeOut($("#welcomeText"), WELCOME);
    var synth = window.speechSynthesis;
    if (!synth || !window.SpeechSynthesisUtterance) { talking(true); setTimeout(function () { talking(false); }, 3200); return; }
    var go = function () {
      var vs = synth.getVoices();
      var en = pickVoice(vs, /^en/i, [/Samantha/i, /Google US English/i, /Zira|Aria|Jenny/i, /female/i]);
      var th = pickVoice(vs, /^th/i, [/Kanya/i, /Google/i, /Premwadee|Achara/i]);
      synth.cancel();
      var u1 = utter(WELCOME_EN, "en-US", en, 1.85, 1.08);
      var u2 = utter(WELCOME, "th-TH", th, 1.7, 1.05);
      u1.onstart = function () { spokenOnce = true; pendingVoice = false; talking(true); };
      u2.onend = function () { talking(false); };
      u1.onerror = function (e) { talking(false); if (!fromGesture && e && /not-allowed/.test(e.error || "")) pendingVoice = true; };
      u2.onerror = function () { talking(false); };
      talking(true);
      synth.speak(u1); synth.speak(u2);
      if (!fromGesture) setTimeout(function () { if (!spokenOnce && !synth.speaking) { talking(false); pendingVoice = true; } }, 1200);
    };
    if (synth.getVoices().length) go();
    else { var done = false; var once = function () { if (!done) { done = true; go(); } }; synth.addEventListener && synth.addEventListener("voiceschanged", once); setTimeout(once, 800); }
  }
  function speak() { speakWelcome(true); }
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (!pendingVoice || spokenOnce || !welcome || welcome.hidden) return;
      if (e.target && e.target.closest && e.target.closest("#welcomeClose,#welcomeSpeak")) return;
      pendingVoice = false; speakWelcome(true);
    }, { passive: true, capture: true });
  });
  if (window.speechSynthesis) { try { speechSynthesis.getVoices(); } catch (e) {} }

  var welcome = $("#welcome"), filmsFab = $("#filmsFab");
  function showWelcome() {
    if (!welcome) return;
    welcome.hidden = false; filmsFab.hidden = true;
    var g = $("#greet"); if (g) g.hidden = true;
    speakWelcome(false);
  }
  function hideWelcome() { welcome.hidden = true; filmsFab.hidden = false; if (window.speechSynthesis) speechSynthesis.cancel(); talking(false); }
  if (welcome) {
    $("#welcomeClose").addEventListener("click", hideWelcome);
    $("#welcomeSpeak").addEventListener("click", function () { speak(); });
    $("#welcomeFilms").addEventListener("click", function () { hideWelcome(); openFilms(); });
    filmsFab.addEventListener("click", function () { openFilms(); });
    if (!ss("debut-welcome")) { ss("debut-welcome", "1"); setTimeout(showWelcome, 2500); }
    else filmsFab.hidden = false;
  }

  var films = $("#films"), items = null, cat = "film", lastFocus = null;
  function embed(it) {
    if (it.kind === "youtube") { var f = el("iframe"); f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(it.ref) + "?rel=0&autoplay=1"; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; f.title = it.title; return f; }
    if (it.kind === "vimeo") { var g = el("iframe"); g.src = "https://player.vimeo.com/video/" + encodeURIComponent(it.ref) + "?autoplay=1"; g.allow = "autoplay; fullscreen; picture-in-picture"; g.allowFullscreen = true; g.title = it.title; return g; }
    var v = el("video"); v.src = it.ref; v.controls = true; v.playsInline = true; v.autoplay = true; return v;
  }
  function play(it) {
    var stage = $("#filmStage"); stage.innerHTML = ""; stage.appendChild(embed(it));
    $("#filmTitle").textContent = it.title;
    document.querySelectorAll("#filmList button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.id === it.id)); });
  }
  function renderFilms() {
    document.querySelectorAll("#filmTabs .chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === cat)); });
    var list = $("#filmList"); list.innerHTML = "";
    var shown = (items || []).filter(function (x) { return x.cat === cat; });
    $("#filmEmpty").hidden = shown.length > 0 || items === null;
    $("#filmMain").hidden = shown.length === 0;
    $("#filmLoading").hidden = items !== null;
    shown.forEach(function (it) {
      var b = el("button", "film-item"); b.type = "button"; b.dataset.id = it.id;
      var th = el("span", "film-thumb");
      if (it.kind === "youtube") { var im = el("img"); im.src = "https://i.ytimg.com/vi/" + encodeURIComponent(it.ref) + "/mqdefault.jpg"; im.alt = ""; im.loading = "lazy"; th.appendChild(im); }
      else th.appendChild(el("span", "mono", it.kind === "vimeo" ? "VIMEO" : "VIDEO"));
      b.appendChild(th); b.appendChild(el("span", "", it.title));
      b.addEventListener("click", function () { play(it); });
      list.appendChild(b);
    });
    if (shown.length) play(shown[0]); else { $("#filmStage").innerHTML = ""; }
  }
  function loadFilms() {
    if (items !== null) return renderFilms();
    renderFilms();
    fetch("/api/media").then(function (r) { return r.json(); }).then(function (j) { items = j.items || []; renderFilms(); })
      .catch(function () { items = []; renderFilms(); });
  }
  function openFilms(c) {
    if (!films) return;
    if (c) cat = c;
    lastFocus = document.activeElement;
    films.hidden = false; document.body.style.overflow = "hidden";
    loadFilms();
    setTimeout(function () { $("#filmsClose").focus(); }, 30);
  }
  function closeFilms() {
    films.hidden = true; document.body.style.overflow = ""; $("#filmStage").innerHTML = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.debutOpenFilms = openFilms;
  if (films) {
    $("#filmsClose").addEventListener("click", closeFilms);
    films.addEventListener("click", function (e) { if (e.target === films) closeFilms(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !films.hidden) closeFilms(); });
    document.querySelectorAll("#filmTabs .chip").forEach(function (b) { b.addEventListener("click", function () { cat = b.dataset.cat; renderFilms(); }); });
    document.addEventListener("click", function (e) { var t = e.target.closest("[data-open-films]"); if (t) { e.preventDefault(); openFilms(t.getAttribute("data-open-films") || ""); } });

    $("#subForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var d = { name: $("#subName").value.trim(), email: $("#subEmail").value.trim(), link: $("#subLink").value.trim(), category: cat === "mc" ? "พิธีกร AI" : "ภาพยนตร์/โฆษณา AI" };
      var msg = $("#subMsg");
      if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || !/^https:\/\//i.test(d.link)) { msg.textContent = "กรอกชื่อ อีเมล และลิงก์วิดีโอที่ขึ้นต้นด้วย https:// ให้ครบ"; msg.className = "sub-msg err"; return; }
      fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "video", data: d, page: "/#films" }) }).catch(function () {});
      msg.textContent = "ได้รับผลงานแล้ว ทีม DEBUT จะตรวจสอบและแจ้งกลับทางอีเมลก่อนเผยแพร่"; msg.className = "sub-msg ok";
      e.target.reset();
    });
  }

  var tf = $("#trialForm");
  if (tf) {
    tf.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("#trialBtn"), msg = $("#trialMsg");
      var d = { name: $("#trName").value.trim(), email: $("#trEmail").value.trim(), phone: $("#trPhone").value.trim(), project: $("#trProject").value };
      if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { msg.hidden = false; msg.className = "trial-msg err"; msg.textContent = "กรุณากรอกชื่อและอีเมลให้ถูกต้อง"; return; }
      if (!$("#trAgree").checked) { msg.hidden = false; msg.className = "trial-msg err"; msg.textContent = "กรุณายอมรับเงื่อนไขการทดลองใช้ก่อน"; return; }
      btn.disabled = true; btn.textContent = "กำลังเตรียมหน้าชำระเงินที่ปลอดภัย…";
      fetch("/api/trial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.checkoutUrl) { location.href = j.checkoutUrl; return; }
          btn.disabled = false; btn.textContent = "เริ่มทดลองใช้ฟรี 30 วัน";
          if (!j.ok) throw new Error("bad");
          msg.hidden = false; msg.className = "trial-msg ok";
          msg.textContent = "ลงทะเบียนสำเร็จ ทีม DEBUT จะส่งลิงก์ยืนยันบัตรแบบปลอดภัย (Stripe) ไปที่ " + d.email + " เพื่อเริ่มสิทธิ์ทดลองใช้ 30 วัน";
          tf.reset();
        })
        .catch(function () { btn.disabled = false; btn.textContent = "เริ่มทดลองใช้ฟรี 30 วัน"; msg.hidden = false; msg.className = "trial-msg err"; msg.textContent = "ส่งข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง"; });
    });
    var q = new URLSearchParams(location.search).get("trial");
    if (q) {
      var m = $("#trialMsg"); m.hidden = false;
      if (q === "success") { m.className = "trial-msg ok"; m.textContent = "ยืนยันบัตรเรียบร้อย สิทธิ์ทดลองใช้สถาปนิกฟรี 30 วันเริ่มแล้ว ทีมจะติดต่อนัดคุยครั้งแรกภายใน 1 วันทำการ"; }
      else { m.className = "trial-msg err"; m.textContent = "ยังไม่ได้ยืนยันบัตร คุณสามารถลองอีกครั้งได้ทุกเมื่อ"; }
      setTimeout(function () { var s = $("#trial"); if (s) s.scrollIntoView(); }, 300);
    }
  }
})();
