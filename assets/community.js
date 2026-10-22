(function () {
  if (window.__debutCommunity || document.getElementById("community")) return; window.__debutCommunity = 1;
  var css = ".cm{background:#F5F5F7;color:#1d1d1f;padding-block:112px 120px;overflow:hidden}" +
    ".cm .eyebrow{color:#6e6e73;text-align:center}" +
    ".cm h2{margin:14px auto 0;max-width:15em;text-align:center;font:600 clamp(34px,5vw,64px)/1.1 var(--f-display);letter-spacing:-.015em}" +
    ".cm h2 span{color:#2438D6}" +
    ".cm .cm-lead{margin:24px auto 0;max-width:40em;text-align:center;font-size:19px;line-height:1.7;color:#424245;font-weight:300}" +
    ".cm-pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:64px}" +
    ".cm-pillar{background:#fff;border-radius:28px;padding:36px 32px 34px;box-shadow:0 2px 24px rgba(0,0,0,.04)}" +
    ".cm-pillar i{display:inline-grid;place-items:center;width:52px;height:52px;border-radius:16px;background:#F5F5F7;font-style:normal;font-size:26px}" +
    ".cm-pillar b{display:block;margin-top:22px;font:600 22px/1.3 var(--f-display)}" +
    ".cm-pillar p{margin:10px 0 0;color:#6e6e73;font-size:16px;line-height:1.7}" +
    ".cm-row-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin:96px 0 24px;flex-wrap:wrap}" +
    ".cm-row-head h3{margin:0;font:600 clamp(26px,3vw,36px)/1.2 var(--f-display)}" +
    ".cm-row-head p{margin:0;color:#6e6e73;font-size:15px;max-width:32em}" +
    ".cm-nav{display:flex;gap:10px}" +
    ".cm-nav button{width:44px;height:44px;border-radius:50%;border:0;background:#e8e8ed;color:#1d1d1f;font-size:20px;cursor:pointer}" +
    ".cm-nav button:hover{background:#d2d2d7}" +
    ".cm-track{display:grid;grid-auto-flow:column;grid-auto-columns:min(400px,82%);gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 24px;scrollbar-width:none}" +
    ".cm-track::-webkit-scrollbar{display:none}" +
    ".cm-card{scroll-snap-align:start;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,.05);transition:transform .5s cubic-bezier(.2,.7,.2,1),box-shadow .5s}" +
    ".cm-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 18px 48px rgba(0,0,0,.10)}" +
    ".cm-card figure{margin:0;aspect-ratio:1/1;overflow:hidden;position:relative}" +
    ".cm-card img{display:block;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}" +
    ".cm-card:hover img{transform:scale(1.05)}" +
    ".cm-card figure span{position:absolute;left:16px;top:16px;background:rgba(255,255,255,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-radius:999px;padding:6px 12px;font:600 11px/1 var(--f-mono);letter-spacing:.12em;color:#1d1d1f}" +
    ".cm-card div{padding:22px 26px 28px}" +
    ".cm-card small{display:block;font:500 12px/1.4 var(--f-mono);letter-spacing:.12em;color:#2438D6;text-transform:uppercase}" +
    ".cm-card b{display:block;margin-top:8px;font:600 22px/1.3 var(--f-display)}" +
    ".cm-card p{margin:8px 0 0;color:#424245;font-size:15px;line-height:1.65}" +
    ".cm-card em{display:block;margin-top:14px;font-style:normal;font-size:13px;color:#6e6e73}" +
    ".cm-fine{margin:8px 0 0;font-size:12px;color:#86868b}" +
    ".cm-cta{margin-top:80px;text-align:center}" +
    ".cm-cta h3{margin:0;font:600 clamp(26px,3.4vw,40px)/1.2 var(--f-display)}" +
    ".cm-cta p{margin:12px auto 0;color:#6e6e73;max-width:34em}" +
    ".cm-cta .row2{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px}" +
    ".cm-cta .pill{min-height:50px;padding:0 28px;border-radius:999px;border:0;font:500 16px var(--f-body);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}" +
    ".cm-cta .pill.blue{background:#2438D6;color:#fff}" +
    ".cm-cta .pill.ghost{background:transparent;color:#2438D6;box-shadow:inset 0 0 0 1.5px #2438D6}" +
    ".cm .rv{opacity:0;transform:translateY(28px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.7,.2,1)}" +
    ".cm .rv.in{opacity:1;transform:none}" +
    "@media (max-width:900px){.cm{padding-block:80px 88px}.cm-pillars{grid-template-columns:1fr}.cm-row-head{margin-top:72px}.cm-nav{display:none}}" +
    "@media (prefers-reduced-motion:reduce){.cm .rv{opacity:1;transform:none;transition:none}.cm-card,.cm-card img{transition:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var P = [
    ["🔨", "งานเล็กก็ใส่ใจ", "ต่อเติมครัว ปรับปรุงห้องน้ำ ทำระเบียง หรือแต่งห้องนอนใหม่ ไม่มีงานไหนเล็กเกินไปสำหรับเรา"],
    ["🏚️", "รีโนเวตอย่างมืออาชีพ", "ตึกแถวเก่า บ้านไม้ อาคารพาณิชย์ เราสำรวจโครงสร้างก่อนเริ่ม และคุมงบด้วย BOQ ที่โปร่งใส"],
    ["🤝", "คอมมูนิตี้นักออกแบบทั่วไทย", "สถาปนิก นักออกแบบภายใน และผู้รับเหมาที่คัดกรองแล้ว DEBUT จับคู่ทีมที่ใช่กับงานของคุณ"]
  ];
  var C = [
    ["heritage-shophouse", "RENOVATION", "Heritage Shophouse Revival", "รีโนเวตตึกแถวเก่าเป็นร้านบูติก เก็บฝ้าเพดานลายและเสาเดิมไว้ เติมแสงและชั้นวางใหม่ให้ร่วมสมัย", "ไซต์ตัวอย่าง ย่านท่าเตียน เขตพระนคร · ราว 280 ตร.ม."],
    ["ribbon-pavilion", "COMMUNITY SPACE", "Ribbon Wood Pavilion", "ศาลาคาเฟ่ชุมชน ระแนงไม้โค้งพลิ้วรับร่มไม้ใหญ่ ผนังกระจกเปิดมุมมองสู่ทางเดินริมคลอง", "ไซต์ตัวอย่าง ริมคลองผดุงกรุงเกษม · ราว 320 ตร.ม."],
    ["dune-boutique", "RETAIL INTERIOR", "Dune Boutique", "ร้านเสื้อผ้าที่ผนังและฝ้าโค้งต่อเนื่องเหมือนเนินทราย แสงธรรมชาติส่องลงจากช่องเปิดกลางร้าน", "ไซต์ตัวอย่าง ย่านสยาม เขตปทุมวัน · ราว 450 ตร.ม."],
    ["timber-veil", "FLAGSHIP STORE", "Timber Veil Flagship", "อาคารร้านค้าหุ้มระแนงไม้แนวตั้ง กรองแดดบ่ายและเรืองแสงอบอุ่นยามค่ำจากภายใน", "ไซต์ตัวอย่าง ทองหล่อ เขตวัฒนา · ราว 600 ตร.ม."]
  ];
  var h = '<section class="cm" id="community" aria-labelledby="cmTitle"><div class="wrap">' +
    '<div class="eyebrow rv">DEBUT COMMUNITY · DESIGN &amp; BUILD PARTNER</div>' +
    '<h2 id="cmTitle" class="rv">งานเล็กก็ใส่ใจ<br>งานใหญ่ก็<span>ไว้ใจได้</span></h2>' +
    '<p class="cm-lead rv">DEBUT คือพาร์ทเนอร์การออกแบบและก่อสร้าง ที่เชื่อมคุณกับคอมมูนิตี้สถาปนิก นักออกแบบ และผู้รับเหมาคุณภาพทั่วประเทศไทย ตั้งแต่ต่อเติมห้องเล็ก ๆ รีโนเวตตึกแถว จนถึงสร้างบ้านทั้งหลัง เราทำงานด้วยใจรัก และตั้งใจส่งมอบความสุขให้ลูกค้าทุกครอบครัว</p>' +
    '<div class="cm-pillars">' + P.map(function (p) { return '<div class="cm-pillar rv"><i aria-hidden="true">' + p[0] + '</i><b>' + p[1] + '</b><p>' + p[2] + '</p></div>'; }).join('') + '</div>' +
    '<div class="cm-row-head rv"><div><h3>แนวคิดการออกแบบจากคอมมูนิตี้</h3><p>ไอเดียตั้งต้นที่ทีมนักออกแบบในเครือข่ายพร้อมพัฒนาต่อให้เข้ากับพื้นที่และงบของคุณ</p></div>' +
    '<div class="cm-nav"><button type="button" data-cm="-1" aria-label="เลื่อนซ้าย">‹</button><button type="button" data-cm="1" aria-label="เลื่อนขวา">›</button></div></div>' +
    '<div class="cm-track" id="cmTrack">' + C.map(function (c) {
      return '<article class="cm-card"><figure><img src="/assets/concepts/' + c[0] + '.webp" alt="ภาพแนวคิด ' + c[2] + '" width="440" height="440" loading="lazy"><span>CONCEPT</span></figure>' +
        '<div><small>' + c[1] + '</small><b>' + c[2] + '</b><p>' + c[3] + '</p><em>' + c[4] + '</em></div></article>';
    }).join('') + '</div>' +
    '<p class="cm-fine">* ภาพในส่วนนี้เป็นภาพแนวคิด (Concept) ที่สร้างด้วย AI เพื่อแสดงแนวทางการออกแบบ ไม่ใช่โครงการที่ก่อสร้างแล้ว ไซต์และขนาดพื้นที่เป็นตัวอย่างประกอบ</p>' +
    '<div class="cm-cta rv"><h3>เริ่มจากงานเล็ก ๆ ของคุณก็ได้</h3><p>เล่าให้เราฟังว่าอยากเปลี่ยนอะไรในบ้าน แล้ว DEBUT จะหาทีมที่ใช่มาดูแลตั้งแต่แบบแรกจนส่งมอบ</p>' +
    '<div class="row2"><button class="pill blue" type="button" data-open-chat data-chat-msg="อยากปรึกษางานต่อเติม/รีโนเวตบ้าน">เล่าโปรเจกต์ให้เราฟัง</button><a class="pill ghost" href="#boq">ประเมินงบเบื้องต้น ›</a></div></div>' +
    '</div></section>';

  var anchor = document.getElementById("why");
  if (!anchor) return;
  anchor.insertAdjacentHTML("beforebegin", h);
  var sec = document.getElementById("community");

  var track = document.getElementById("cmTrack");
  sec.querySelectorAll("[data-cm]").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = track.querySelector(".cm-card");
      track.scrollBy({ left: (+b.getAttribute("data-cm")) * (card ? card.offsetWidth + 20 : 400), behavior: "smooth" });
    });
  });

  var rv = sec.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rv.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 0.08 + "s"; io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });
})();
