(function () {
  if (window.__debutShowcase || document.getElementById("showcase")) return; window.__debutShowcase = 1;
  var S = "/assets/showcase/";
  var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css =
    ".sc{background:#0b0b0c;color:#f2f2f0;position:relative;overflow:clip}" +
    ".sc img{display:block;max-width:none}" +
    ".sc-hero{position:relative;height:100vh;height:100svh;min-height:560px;overflow:hidden}" +
    ".sc-hero .bg{position:absolute;inset:-6% 0 -6% 0;will-change:transform}" +
    ".sc-hero .bg img{width:100%;height:100%;object-fit:cover;object-position:50% 60%;transform:scale(1.18);animation:scKb 16s cubic-bezier(.2,.6,.2,1) forwards}" +
    "@keyframes scKb{to{transform:scale(1.02)}}" +
    ".sc-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.05) 55%,rgba(5,5,6,.82) 100%);pointer-events:none}" +
    ".sc-hero .in{position:absolute;left:0;right:0;bottom:clamp(56px,11vh,120px);z-index:2;padding-inline:clamp(16px,5vw,72px)}" +
    ".sc-eyebrow{font:500 12px/1 var(--f-body,system-ui);letter-spacing:.32em;text-transform:uppercase;color:rgba(242,242,240,.78);display:flex;gap:12px;align-items:center}" +
    ".sc-eyebrow:before{content:'';width:36px;height:1px;background:currentColor}" +
    ".sc-hero h2{margin:22px 0 0;font:600 clamp(44px,9vw,132px)/.98 var(--f-display,inherit);letter-spacing:-.03em;max-width:12em}" +
    ".sc-w{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.06em}" +
    ".sc-w>span{display:inline-block;transform:translateY(105%);transition:transform 1.1s cubic-bezier(.2,.75,.15,1)}" +
    ".sc-hero.go .sc-w>span{transform:none}" +
    ".sc-hero p{margin:22px 0 0;max-width:34em;font-size:clamp(16px,1.5vw,20px);line-height:1.65;font-weight:300;color:rgba(242,242,240,.86);opacity:0;transform:translateY(16px);transition:1s 1.1s cubic-bezier(.2,.75,.15,1)}" +
    ".sc-hero.go p{opacity:1;transform:none}" +
    ".sc-tag{display:inline-block;margin-top:18px;padding:6px 12px;border:1px solid rgba(255,255,255,.28);border-radius:99px;font-size:12px;letter-spacing:.08em;color:rgba(255,255,255,.75);backdrop-filter:blur(8px);background:rgba(0,0,0,.18)}" +
    ".sc-cue{position:absolute;left:50%;bottom:22px;z-index:2;width:1px;height:46px;background:rgba(255,255,255,.22);overflow:hidden;transform:translateX(-50%)}" +
    ".sc-cue:after{content:'';position:absolute;left:0;top:-50%;width:1px;height:50%;background:#fff;animation:scCue 2.2s cubic-bezier(.6,0,.3,1) infinite}" +
    "@keyframes scCue{to{top:110%}}" +
    ".sc-snd{position:fixed;right:16px;top:116px;z-index:60;display:flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 12px;border-radius:99px;border:1px solid rgba(255,255,255,.18);background:rgba(20,20,22,.72);color:#fff;font:500 13px/1 var(--f-body,system-ui);backdrop-filter:blur(12px);cursor:pointer;opacity:0;transform:translateY(-8px);pointer-events:none;transition:.4s}" +
    ".sc-snd.on{opacity:1;transform:none;pointer-events:auto}" +
    ".sc-snd i{font-style:normal;display:flex;gap:2px;align-items:flex-end;height:14px}" +
    ".sc-snd i b{width:2px;background:#fff;border-radius:1px;height:4px}" +
    ".sc-snd.play i b{animation:scEq 1s ease-in-out infinite}" +
    ".sc-snd.play i b:nth-child(2){animation-delay:.2s}.sc-snd.play i b:nth-child(3){animation-delay:.4s}" +
    "@keyframes scEq{50%{height:14px}}" +
    ".sc-retail{padding:clamp(80px,12vw,150px) 0 0}" +
    ".sc-head{padding-inline:clamp(16px,5vw,72px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:24px 48px;align-items:end}" +
    ".sc-head h3{margin:16px 0 0;font:600 clamp(34px,5.4vw,76px)/1.04 var(--f-display,inherit);letter-spacing:-.025em}" +
    ".sc-head p{margin:0;color:rgba(242,242,240,.72);font-size:17px;line-height:1.75;font-weight:300}" +
    ".sc-xp{position:relative;height:170vh;margin-top:56px}" +
    ".sc-xp .stick{position:sticky;top:0;height:100vh;display:grid;place-items:center;overflow:hidden}" +
    ".sc-xp figure{margin:0;position:relative;width:calc(62% + 38% * var(--p,0));height:calc(62vh + 38vh * var(--p,0));border-radius:calc(28px * (1 - var(--p,0)));overflow:hidden;will-change:width,height}" +
    ".sc-xp figure img{width:100%;height:100%;object-fit:cover;transform:scale(calc(1.25 - .25 * var(--p,0)))}" +
    ".sc-xp figcaption{position:absolute;left:clamp(16px,4vw,48px);bottom:clamp(20px,5vh,48px);right:16px;opacity:var(--p,0);transform:translateY(calc(20px * (1 - var(--p,0))))}" +
    ".sc-xp figcaption b{display:block;font:600 clamp(26px,4vw,54px)/1.1 var(--f-display,inherit);letter-spacing:-.02em;text-shadow:0 2px 30px rgba(0,0,0,.4)}" +
    ".sc-xp figcaption span{display:block;margin-top:10px;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.8)}" +
    ".sc-xp figure:after{content:'';position:absolute;inset:40% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.6));opacity:var(--p,0)}" +
    ".sc-xp figcaption{z-index:1}" +
    ".sc-hz{position:relative}" +
    ".sc-hz .stick{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding-top:88px;box-sizing:border-box}" +
    ".sc-hz .lbl{padding-inline:clamp(16px,5vw,72px);display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:26px}" +
    ".sc-hz .lbl b{font:600 clamp(22px,2.4vw,32px)/1.2 var(--f-display,inherit)}" +
    ".sc-hz .lbl span{font-size:13px;letter-spacing:.2em;color:rgba(242,242,240,.6);font-variant-numeric:tabular-nums}" +
    ".sc-track{display:flex;gap:clamp(14px,2vw,28px);padding-inline:clamp(16px,5vw,72px);will-change:transform}" +
    ".sc-card{flex:0 0 auto;width:min(60vh,78vw);margin:0;position:relative}" +
    ".sc-card .ph{aspect-ratio:1/1;border-radius:22px;overflow:hidden;background:#1a1a1c}" +
    ".sc-card img{width:100%;height:100%;object-fit:cover;transform:scale(1.12);transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}" +
    ".sc-card.vis img{transform:scale(1)}" +
    ".sc-card figcaption{margin-top:14px;display:flex;justify-content:space-between;gap:12px;font-size:14px;color:rgba(242,242,240,.7)}" +
    ".sc-card figcaption b{color:#fff;font-weight:500}" +
    ".sc-prog{margin:28px clamp(16px,5vw,72px) 0;height:2px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden}" +
    ".sc-prog i{display:block;height:100%;width:100%;background:#fff;transform-origin:0 50%;transform:scaleX(var(--g,0))}" +
    ".sc-cph{padding:clamp(90px,12vw,150px) clamp(16px,5vw,72px) clamp(90px,10vw,130px);background:linear-gradient(180deg,#0b0b0c,#141416)}" +
    ".sc-cph .sc-head{padding:0}" +
    ".sc-pt{display:inline-flex;align-items:center;gap:10px;margin-top:26px;padding:8px 16px 8px 10px;border-radius:99px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);font-size:13px;color:rgba(255,255,255,.82)}" +
    ".sc-pt i{width:22px;height:22px;border-radius:50%;background:#C8102E;display:grid;place-items:center;font-style:normal;font-weight:700;font-size:11px;color:#fff}" +
    ".sc-bento{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(0,auto);gap:16px;margin-top:56px}" +
    ".sc-bento figure{margin:0;border-radius:22px;overflow:hidden;position:relative;background:#1a1a1c;cursor:zoom-in}" +
    ".sc-bento figure img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}" +
    ".sc-bento figure:hover img{transform:scale(1.04)}" +
    ".sc-bento .a{grid-column:span 2;grid-row:span 2}" +
    ".sc-bento .b{grid-column:span 2}" +
    ".sc-bento figcaption{position:absolute;left:14px;top:14px;padding:5px 10px;border-radius:99px;background:rgba(0,0,0,.45);backdrop-filter:blur(8px);font-size:12px;letter-spacing:.06em;color:#fff}" +
    ".sc-note{margin:40px 0 0;font-size:13px;line-height:1.7;color:rgba(242,242,240,.5);max-width:60em}" +
    ".sc-rv{clip-path:inset(18% 0 0 0 round 22px);opacity:0;transform:translateY(48px);transition:clip-path 1.2s cubic-bezier(.2,.75,.15,1),opacity .9s,transform 1.2s cubic-bezier(.2,.75,.15,1)}" +
    ".sc-rv.vis{clip-path:inset(0 0 0 0 round 22px);opacity:1;transform:none}" +
    ".sc-fd{opacity:0;transform:translateY(28px);transition:opacity 1s,transform 1.1s cubic-bezier(.2,.75,.15,1)}" +
    ".sc-fd.vis{opacity:1;transform:none}" +
    ".sc-lb{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.92);display:grid;place-items:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .35s}" +
    ".sc-lb.on{opacity:1;pointer-events:auto}" +
    ".sc-lb img{max-width:min(1100px,100%);max-height:86vh;border-radius:14px;transform:scale(.94);transition:transform .45s cubic-bezier(.2,.75,.15,1)}" +
    ".sc-lb.on img{transform:none}" +
    ".sc-lb button{position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:22px;cursor:pointer}" +
    "@media (max-width:860px){.sc-snd{top:80px}.sc-hz .stick{padding-top:64px}.sc-head{grid-template-columns:1fr}.sc-bento{grid-template-columns:repeat(2,minmax(0,1fr))}.sc-bento .a{grid-column:span 2;grid-row:auto}.sc-bento .b{grid-column:span 2}.sc-xp{height:140vh}.sc-xp figure{height:calc(52vh + 48vh * var(--p,0));width:calc(86% + 14% * var(--p,0))}.sc-card{width:80vw}}" +
    "@media (prefers-reduced-motion:reduce){.sc-hero .bg img{animation:none;transform:none}.sc-w>span,.sc-hero p{transform:none!important;opacity:1!important;transition:none}.sc-rv,.sc-fd{clip-path:none;opacity:1;transform:none;transition:none}.sc-xp{height:auto}.sc-xp .stick{position:static;height:auto;padding:0 16px}.sc-xp figure{width:100%;height:70vh;--p:1}.sc-hz{height:auto!important}.sc-hz .stick{position:static;height:auto;padding:40px 0}.sc-track{overflow-x:auto;transform:none!important;scroll-snap-type:x mandatory}.sc-card{scroll-snap-align:start}.sc-card img{transform:none}}";
  var st = document.createElement("style"); st.id = "sc-css"; st.textContent = css; document.head.appendChild(st);

  function words(t) { return t.split(" ").map(function (w, i) { return '<span class="sc-w"><span style="transition-delay:' + (0.15 + i * 0.12).toFixed(2) + 's">' + w + '</span></span>'; }).join(" "); }
  var G = [
    ["organic-grid", "Fluid Pavilion", "4 มุมมอง"],
    ["retail-grid-a", "Arch Flagship", "กลางวัน · ค่ำคืน"],
    ["retail-grid-b", "Glass Atrium", "มุมถนน · ทางเข้า"],
    ["slat-grid", "Timber Slat House", "ใต้ร่มไม้"],
    ["retail-grid-c", "Curved Slat Store", "2 แนวคิดด้านหน้า"],
    ["ribbon-grid", "Ribbon Canopy", "ทางเดินและทางจักรยาน"]
  ];
  var cards = G.map(function (g, i) {
    return '<figure class="sc-card" data-i="' + i + '"><div class="ph"><img src="' + S + g[0] + '.webp" alt="ภาพแนวคิด ' + g[1] + '" width="640" height="640" loading="lazy" decoding="async"></div><figcaption><b>' + g[1] + '</b><span>' + g[2] + '</span></figcaption></figure>';
  }).join("");
  var C = [["cph-long", "a", "Pavilion Residence", 600, 538], ["cph-living", "", "Living", 600, 600], ["cph-bedroom", "", "Bedroom", 600, 600], ["cph-kitchen", "", "Kitchen", 600, 600], ["cph-laptop", "", "Mountain Villa", 600, 600]];
  var bento = C.map(function (c, i) {
    return '<figure class="sc-rv ' + c[1] + '" style="transition-delay:' + (i * 0.08).toFixed(2) + 's" data-full="' + S + c[0] + '.webp"><img src="' + S + c[0] + '.webp" alt="งานออกแบบ ' + c[2] + ' โดย Copenhagen Development" width="' + c[3] + '" height="' + c[4] + '" loading="lazy" decoding="async"><figcaption>' + c[2] + '</figcaption></figure>';
  }).join("");

  var h = '<section class="sc" id="showcase" aria-label="DEBUT Concept Showcase">' +
    '<div class="sc-hero"><div class="bg"><img src="' + S + 'wall-organic.webp" alt="ภาพแนวคิดอาคารรูปทรงออร์แกนิกสีขาว" width="1024" height="1024" fetchpriority="high"></div>' +
    '<div class="in"><div class="sc-eyebrow">DEBUT · Concept Showcase</div>' +
    '<h2>' + words("Form, unbound.") + '</h2>' +
    '<p>รูปทรงที่ไหลเหมือนผ้าไหม แสงที่ลอดผ่านซี่ไม้ และพื้นที่ที่ชวนให้คนหยุดมอง — แนวคิดสถาปัตยกรรมจากทีม DEBUT ที่พร้อมพัฒนาต่อเป็นโครงการจริงของคุณ</p>' +
    '<span class="sc-tag">AI Concept Render</span></div><div class="sc-cue" aria-hidden="true"></div></div>' +
    '<div class="sc-retail"><div class="sc-head sc-fd"><div><div class="sc-eyebrow">Retail Flagship</div><h3>ร้านที่เป็นมากกว่าร้าน<br>คือแลนด์มาร์กของเมือง</h3></div>' +
    '<p>ผนังซี่ไม้โค้งสูงเต็มหน้าอาคาร เปิดรับแสงอุ่นจากภายในสู่ถนน ออกแบบให้แบรนด์ของคุณถูกจดจำตั้งแต่แวบแรก — ทั้งหมดนี้เป็นภาพแนวคิดสำหรับร้านค้าแฟลกชิป</p></div>' +
    '<div class="sc-xp"><div class="stick"><figure><img src="' + S + 'retail-hero.webp" alt="ภาพแนวคิดร้านแฟลกชิปผนังซี่ไม้โค้ง" width="900" height="900" loading="lazy" decoding="async"><figcaption><b>Timber Veil Flagship</b><span>Concept · Retail</span></figcaption></figure></div></div></div>' +
    '<div class="sc-hz"><div class="stick"><div class="lbl"><b>แกลเลอรีแนวคิด</b><span class="ct">01 / 0' + G.length + '</span></div><div class="sc-track">' + cards + '</div><div class="sc-prog"><i></i></div></div></div>' +
    '<div class="sc-cph"><div class="sc-head sc-fd"><div><div class="sc-eyebrow">Partner · Copenhagen Development</div><h3>บ้านที่ออกแบบ<br>เพื่อชีวิตประจำวัน</h3>' +
    '<div class="sc-pt"><i>C</i>COPENHAGEN DEVELOPMENT × DEBUT</div></div>' +
    '<p>Copenhagen Development บริษัทพาร์ตเนอร์ของเรา ดูแลงานออกแบบและพัฒนาที่อยู่อาศัยแนว Limited Design — เส้นสายเรียบ วัสดุธรรมชาติ และแสงที่อบอุ่น ร่วมกับ DEBUT ตั้งแต่แนวคิดจนถึงการก่อสร้าง</p></div>' +
    '<div class="sc-bento">' + bento + '</div>' +
    '<p class="sc-note">ภาพในส่วน Concept Showcase เป็นภาพแนวคิด (Concept Render) เพื่อแสดงทิศทางการออกแบบ ไม่ใช่อาคารที่ก่อสร้างแล้ว และไม่ได้สื่อถึงความเกี่ยวข้องกับแบรนด์ใด · ภาพในส่วนพาร์ตเนอร์เป็นงานออกแบบของ Copenhagen Development</p></div>' +
    '</section>';

  var anchor = document.getElementById("projects") || document.getElementById("why");
  if (anchor) anchor.insertAdjacentHTML("beforebegin", h); else document.body.insertAdjacentHTML("beforeend", h);
  var sec = document.getElementById("showcase");

  var tile = document.querySelector('#projects figure[data-zoom="THE BARAI · HUA HIN"]');
  if (tile) {
    var ti = tile.querySelector("img");
    if (ti) { ti.src = S + "retail-hero.webp"; ti.width = 900; ti.height = 900; ti.alt = "ภาพแนวคิดร้านแฟลกชิปผนังซี่ไม้โค้ง"; ti.removeAttribute("style"); }
    tile.setAttribute("data-zoom", "TIMBER VEIL FLAGSHIP · CONCEPT");
    var tc = tile.querySelector("figcaption"); if (tc) tc.textContent = "CONCEPT · RETAIL";
  }

  // ---- sound ----
  var snd = document.createElement("button"); snd.type = "button"; snd.className = "sc-snd"; snd.setAttribute("aria-pressed", "false");
  snd.innerHTML = '<i aria-hidden="true"><b></b><b></b><b></b></i><span>เสียง</span>';
  document.body.appendChild(snd);
  var pref = null; try { pref = localStorage.getItem("debutSound"); } catch (e) {}
  var want = pref === null ? !RM : pref === "1";
  var ctx = null, last = 0, unlocked = false;
  function ui() { snd.classList.toggle("play", want && unlocked); snd.setAttribute("aria-pressed", want ? "true" : "false"); snd.querySelector("span").textContent = want ? (unlocked ? "เสียง เปิด" : "แตะเพื่อเปิดเสียง") : "เสียง ปิด"; }
  function unlock() {
    if (unlocked || !want) return;
    try { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = ctx || new AC(); if (ctx.state === "suspended") ctx.resume(); unlocked = true; ui(); } catch (e) {}
  }
  ["pointerdown", "keydown", "touchend"].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });
  snd.addEventListener("click", function (e) {
    e.stopPropagation(); want = !want; try { localStorage.setItem("debutSound", want ? "1" : "0"); } catch (er) {}
    if (want) { unlocked = false; unlock(); setTimeout(function () { play("w"); }, 60); } ui();
  });
  ui();
  var noise = null;
  function play(kind) {
    if (!want || !unlocked || !ctx) return;
    var now = performance.now(); if (now - last < 420) return; last = now;
    try {
      var t = ctx.currentTime, g = ctx.createGain();
      if (kind === "t") {
        var o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(1320, t); o.frequency.exponentialRampToValueAtTime(880, t + .18);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + .32);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .35); return;
      }
      if (!noise) { var len = ctx.sampleRate * 1.2; noise = ctx.createBuffer(1, len, ctx.sampleRate); var d = noise.getChannelData(0); for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; }
      var src = ctx.createBufferSource(); src.buffer = noise;
      var f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 0.9;
      f.frequency.setValueAtTime(320, t); f.frequency.exponentialRampToValueAtTime(2200, t + .45); f.frequency.exponentialRampToValueAtTime(700, t + .9);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + .28); g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      src.connect(f).connect(g).connect(ctx.destination); src.start(t); src.stop(t + 1.05);
    } catch (e) {}
  }

  // ---- reveal ----
  var hero = sec.querySelector(".sc-hero");
  requestAnimationFrame(function () { setTimeout(function () { hero.classList.add("go"); }, 120); });
  var els = sec.querySelectorAll(".sc-rv,.sc-fd,.sc-card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; e.target.classList.add("vis"); io.unobserve(e.target);
        if (e.target.classList.contains("sc-fd")) play("w");
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
    var vio = new IntersectionObserver(function (es) { es.forEach(function (e) { snd.classList.toggle("on", e.isIntersecting); }); }, { threshold: 0 });
    vio.observe(sec);
  } else { els.forEach(function (el) { el.classList.add("vis"); }); snd.classList.add("on"); }

  // ---- scroll-driven ----
  var bg = hero.querySelector(".bg"), xp = sec.querySelector(".sc-xp"), xfig = xp.querySelector("figure");
  var hz = sec.querySelector(".sc-hz"), track = sec.querySelector(".sc-track"), prog = sec.querySelector(".sc-prog"), ct = sec.querySelector(".sc-hz .ct");
  var dist = 0, idx = 0, xpDone = false, tick = false;
  function size() {
    if (RM) return;
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    hz.style.height = (window.innerHeight + dist) + "px";
    frame();
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function frame() {
    tick = false; if (RM) return;
    var vh = window.innerHeight;
    var hr = hero.getBoundingClientRect();
    if (hr.bottom > 0) bg.style.transform = "translate3d(0," + (-hr.top * 0.28).toFixed(1) + "px,0)";
    var xr = xp.getBoundingClientRect();
    var p = clamp(-xr.top / Math.max(1, xr.height - vh));
    p = 1 - Math.pow(1 - p, 2);
    xfig.style.setProperty("--p", p.toFixed(3));
    if (p > 0.92 && !xpDone) { xpDone = true; play("w"); } else if (p < 0.5) xpDone = false;
    var r = hz.getBoundingClientRect();
    var g = clamp(-r.top / Math.max(1, r.height - vh));
    track.style.transform = "translate3d(" + (-g * dist).toFixed(1) + "px,0,0)";
    prog.style.setProperty("--g", g.toFixed(3));
    var n = Math.min(G.length - 1, Math.round(g * (G.length - 1)));
    if (n !== idx) { idx = n; ct.textContent = "0" + (n + 1) + " / 0" + G.length; play("t"); }
  }
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", size);
  window.addEventListener("load", size);
  sec.querySelectorAll("img").forEach(function (im) { if (!im.complete) im.addEventListener("load", size, { once: true }); });
  size();

  // ---- lightbox ----
  var lb = document.createElement("div"); lb.className = "sc-lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
  lb.innerHTML = '<img alt=""><button type="button" aria-label="ปิด">×</button>'; document.body.appendChild(lb);
  var lbi = lb.querySelector("img");
  function close() { lb.classList.remove("on"); }
  lb.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  sec.addEventListener("click", function (e) {
    var f = e.target.closest(".sc-bento figure,.sc-card,.sc-xp figure"); if (!f) return;
    var im = f.querySelector("img"); lbi.src = im.src; lbi.alt = im.alt; lb.classList.add("on"); play("t");
  });
})();
