(function () {
  if (window.__debutProjects) return; window.__debutProjects = 1;
  if (!document.querySelector('link[href="/assets/projects.css"]')) {
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/assets/projects.css"; document.head.appendChild(l);
  }
  var nav = document.getElementById("nav");
  if (nav && !nav.querySelector('a[href="#projects"]')) {
    var f = nav.querySelector("[data-open-films]"); if (f) f.remove();
    var a = document.createElement("a"); a.href = "#projects"; a.textContent = "PROJECTS"; nav.insertBefore(a, nav.firstChild);
    a.addEventListener("click", function () { nav.classList.remove("open"); });
  }
  if (document.getElementById("projects")) return;
  var why = document.getElementById("why");
  if (!why) return;
  var CH = [
    { img: "ritz-pavilion", w: 670, h: 689, inset: ["ritz-drawing", 458, 689, "แบบรูปด้านศาลาไทย", "CONCEPT ELEVATION · RITZ-CARLTON PAVILION"], zoom: "THE RITZ-CARLTON PHULAY BAY · KRABI · 2024", alt: "ศาลาไทยหลังคาซ้อนชั้นสะท้อนผิวน้ำ The Ritz-Carlton Phulay Bay", cat: "LUXURY RESORT", name: "The Ritz-Carlton Phulay Bay", loc: "กระบี่ ประเทศไทย", copy: "ศาลาไทยหลังคาซ้อนชั้นที่ลอยเหนือผืนน้ำ เส้นสายจากแบบร่างกลายเป็นแสงยามค่ำ ถ่ายทอดภูมิปัญญาสถาปัตยกรรมไทยสู่รีสอร์ตลักซ์ชัวรีระดับโลก", dl: [["Year", "2024"], ["Area", "50,000 ตร.ม."], ["Role", "Concept Design"]] },
    { img: "swiss-lounge", w: 820, h: 551, zoom: "SWISSÔTEL LIVING JAKARTA MEGA KUNINGAN", alt: "เลานจ์ไม้โทนอุ่นวิวเมือง Swissôtel Living Jakarta", cat: "HOSPITALITY INTERIOR", name: "Swissôtel Living Jakarta Mega Kuningan", loc: "จาการ์ตา อินโดนีเซีย", copy: "เลานจ์บนตึกสูงที่ฝ้าระแนงไม้ทอดยาวรับวิวเมือง แสงอุ่นและวัสดุธรรมชาติสร้างบรรยากาศแบบ “บ้าน” ให้แขกที่เข้าพักระยะยาว", dl: [["Year", "2018–2022"], ["Area", "5,000 ตร.ม."], ["Role", "Concept Design"]] },
    { img: "kure-hall", w: 626, h: 416, zoom: "KURE KIZUNA HALL · KURE, HIROSHIMA · 2020", alt: "หอประชุม Kure Kizuna Hall ที่นั่งสีแดงและระเบียงโค้งไม้", cat: "PERFORMING ARTS", name: "Kure Kizuna Hall", loc: "คุเระ ฮิโรชิมา ญี่ปุ่น", copy: "หอประชุมที่ระเบียงชั้นบนโค้งไหลต่อเนื่องดั่งคลื่น ผนังไม้ช่วยทั้งความงามและอะคูสติก เพื่อให้ทุกที่นั่งได้ยินชัดเท่ากัน", dl: [["Year", "2020"], ["Area", "1,000 ตร.ม."], ["Role", "Concept Design"]] },
    { img: "stadium", w: 448, h: 208, small: 1, zoom: "JAPAN NATIONAL STADIUM · TOKYO", alt: "Japan National Stadium สนามกีฬาหลักโอลิมปิกโตเกียว 2020", cat: "OLYMPIC STADIUM", name: "Japan National Stadium", loc: "โตเกียว ญี่ปุ่น · สนามหลัก Olympic Games Tokyo 2020", copy: "ร่วมงานกับ Kengo Kuma ในบทบาท BIM Coordinator ประสานแบบสถาปัตย์ โครงสร้าง และงานระบบของสนามกีฬาระดับโลกให้ตรงกันก่อนลงมือสร้างจริง ประสบการณ์เดียวกับที่ DEBUT ใช้คุมแบบให้ทุกโครงการ", dl: [["Event", "Tokyo 2020"], ["Lead Architect", "Kengo Kuma"], ["Role", "BIM Coordinator"]] },
    { img: "chanel", w: 900, h: 383, zoom: "CHANEL · EMQUARTIER, BANGKOK", alt: "หน้าร้าน CHANEL ที่ EmQuartier กรุงเทพฯ", cat: "LUXURY RETAIL", name: "CHANEL", loc: "EmQuartier กรุงเทพมหานคร", copy: "ฟาซาดขาวบริสุทธิ์ตัดกับกล่องดำ เส้นสายเรียบนิ่งที่สะท้อนตัวตนของแบรนด์หรู ณ ใจกลางสุขุมวิท", dl: [["Type", "Flagship Boutique"], ["City", "Bangkok"], ["Sector", "Luxury Retail"]] },
    { img: "barai", w: 785, h: 558, zoom: "THE BARAI & HYATT REGENCY HUA HIN · 2024", alt: "คอร์ตสีแดงล้อมระเบียงเสา The Barai หัวหิน", cat: "WELLNESS RESORT", name: "The Barai &amp; Hyatt Regency Hua Hin", loc: "หัวหิน ประจวบคีรีขันธ์", copy: "คอร์ตสีแดงเข้มที่ล้อมด้วยระเบียงเสา ความเงียบ แสง และเงาถูกออกแบบให้เป็นส่วนหนึ่งของการพักผ่อนแบบเวลเนส", dl: [["Year", "2024"], ["Area", "20,000 ตร.ม."], ["Role", "Concept Design"]] }
  ];
  // Chapter 02: Four Seasons Hotel Bangkok at Chao Phraya River as an auto-playing slideshow.
  // The original Swissôtel lounge photo stays as the last slide, with its own project text.
  var SW = CH[1];
  var FS = { cat: "LUXURY HOTEL & RESIDENCES", name: "Four Seasons Hotel Bangkok at Chao Phraya River", loc: "กรุงเทพมหานคร · ริมแม่น้ำเจ้าพระยา",
    copy: "ห้องพักและสวีทริมแม่น้ำเจ้าพระยา กระจกสูงจรดฝ้ารับวิวเมืองและสายน้ำ ระเบียงสวนลอยฟ้า และสระอินฟินิตี้ที่ทอดตัวไปกับแม่น้ำ งานภายในโทนอุ่นเรียบหรูด้วยไม้ หินอ่อน ผ้าเนื้อนุ่ม และงานศิลปะไทยร่วมสมัย",
    dl: [["City", "Bangkok"], ["Setting", "Chao Phraya River"], ["Sector", "Luxury Hospitality"]], zoom: "FOUR SEASONS HOTEL BANGKOK AT CHAO PHRAYA RIVER" };
  var FS_SLIDES = [
    ["fs-02", 1400, 788, "เลานจ์ริมสระอินฟินิตี้วิวแม่น้ำเจ้าพระยา"], ["fs-01", 1340, 754, "ห้องพักวิวแม่น้ำเจ้าพระยาและเส้นขอบฟ้ากรุงเทพฯ"],
    ["fs-04", 1400, 788, "ห้องนั่งเล่นสวีทเปิดสู่ระเบียงสวนลอยฟ้า"], ["fs-05", 1112, 1482, "มุมพักผ่อนริมกระจกรับแสงเช้าเหนือแม่น้ำ"],
    ["fs-03", 1340, 754, "ห้องนอนเปิดสู่ระเบียงวิวเมือง"], ["fs-06", 1340, 754, "ห้องนั่งเล่นท่ามกลางต้นไม้ใหญ่"],
    ["fs-07", 1400, 788, "ห้องนอนสวีทกับระเบียงต้นลีลาวดี"], ["fs-09", 1400, 788, "ห้องอาหารส่วนตัวในสวีท"],
    ["fs-10", 1112, 1482, "มุมรับประทานอาหารกับงานศิลปะไทยร่วมสมัย"], ["fs-08", 1340, 754, "ห้องน้ำหินอ่อนพร้อมอ่างแช่ตัว"]
  ];
  CH[1] = Object.assign({}, SW, FS, { show: [FS, SW] });
  var P = "/assets/projects/";
  function img(n, w, h, alt, ar) { return '<img src="' + P + n + '.webp" alt="' + alt + '" width="' + w + '" height="' + h + '" loading="lazy"' + (ar ? ' style="aspect-ratio:' + w + '/' + h + '"' : '') + '>'; }
  function showFrame(c) {
    var slides = FS_SLIDES.map(function (s) { return { g: 0, src: s[0], w: s[1], h: s[2], alt: s[3] }; });
    slides.push({ g: 1, src: SW.img, w: SW.w, h: SW.h, alt: SW.alt });
    return '<figure class="pj-frame pj-show" data-zoom="' + c.zoom.replace(/&/g, '&amp;') + '" aria-roledescription="carousel">' +
      slides.map(function (s, k) {
        return '<div class="pj-slide' + (k ? '' : ' on') + '" data-g="' + s.g + '"><img class="bg" src="' + P + s.src + '.webp" alt="" aria-hidden="true" loading="lazy">' +
          '<img class="fg' + (s.h > s.w ? ' tall' : '') + '" src="' + P + s.src + '.webp" alt="' + s.alt + '" width="' + s.w + '" height="' + s.h + '" loading="lazy"></div>';
      }).join('') +
      '<span class="pj-show-tag">' + c.show[0].name + '</span><span class="pj-show-no mono">01 / ' + String(slides.length).padStart(2, "0") + '</span>' +
      '<div class="pj-show-bar">' + slides.map(function () { return '<i><b></b></i>'; }).join('') + '</div>' +
      '<button class="pj-show-nav prev" type="button" aria-label="ภาพก่อนหน้า">‹</button><button class="pj-show-nav next" type="button" aria-label="ภาพถัดไป">›</button></figure>';
  }
  var names = CH.map(function (c) { return c.name; });
  names[4] = "CHANEL · EmQuartier"; names[1] = "Four Seasons Bangkok"; names.splice(2, 0, "Swissôtel Living Jakarta");
  var mq = '<div>' + names.map(function (n) { return '<span>' + n + '</span><i>✦</i>'; }).join('') + '</div>';
  var h = '<section class="pj" id="projects" aria-labelledby="pjTitle"><div class="wrap pj-open"><div>' +
    '<div class="eyebrow">OUR WORK · BAUHAUS DESIGN TEAM</div>' +
    '<h2 id="pjTitle">จากศาลาริมทะเลกระบี่<br>ถึงสนามกีฬา<em>โอลิมปิกโตเกียว</em></h2>' +
    '<p>ทีมออกแบบเบื้องหลัง DEBUT เคยร่วมสร้างงานให้แบรนด์โรงแรมและแบรนด์หรูระดับโลกใน 3 ประเทศ วันนี้ประสบการณ์ชุดเดียวกันพร้อมดูแลโครงการของคุณ</p>' +
    '<div class="pj-stats"><div><b data-count="7">7</b><span>Selected projects</span></div><div><b data-count="3">3</b><span>Countries</span></div><div><b data-count="76000" data-suffix="+">76,000+</b><span>sqm concept design</span></div></div></div>' +
    '<div class="pj-mosaic">' +
    '<figure data-zoom="THE RITZ-CARLTON PHULAY BAY · KRABI">' + img("ritz-pavilion", 670, 689, "ศาลาไทยริมน้ำ The Ritz-Carlton Phulay Bay กระบี่ ยามค่ำ") + '<figcaption>KRABI</figcaption></figure>' +
    '<figure data-zoom="JAPAN NATIONAL STADIUM · TOKYO">' + img("stadium", 448, 208, "Japan National Stadium โตเกียว") + '<figcaption>TOKYO</figcaption></figure>' +
    '<figure data-zoom="KURE KIZUNA HALL · HIROSHIMA">' + img("kure-hall", 626, 416, "หอประชุม Kure Kizuna Hall ที่นั่งสีแดงและระเบียงโค้ง") + '<figcaption>HIROSHIMA</figcaption></figure>' +
    '<figure data-zoom="THE BARAI · HUA HIN">' + img("barai", 785, 558, "คอร์ตสีแดงของ The Barai หัวหิน") + '<figcaption>HUA HIN</figcaption></figure>' +
    '</div></div><div class="pj-marquee" aria-hidden="true">' + mq + mq + '</div><div class="wrap">';
  CH.forEach(function (c, i) {
    h += '<article class="pj-ch' + (i % 2 ? ' rev' : '') + '"><div class="pj-media">' +
      (c.show ? showFrame(c) :
      '<figure class="pj-frame"' + (c.small ? ' style="max-width:600px;margin-left:auto"' : '') + ' data-zoom="' + c.zoom.replace(/&/g, '&amp;') + '">' + img(c.img, c.w, c.h, c.alt, 1) + '</figure>') +
      (c.inset ? '<figure class="pj-inset" data-zoom="' + c.inset[4] + '">' + img(c.inset[0], c.inset[1], c.inset[2], c.inset[3]) + '<span>DRAWING</span></figure>' : '') +
      '</div><div class="pj-text"><div class="pj-idx"><b>0' + (i + 1) + '</b> / 06 · ' + c.cat + '</div><h3>' + c.name + '</h3><p class="pj-loc">' + c.loc + '</p><p class="pj-copy">' + c.copy + '</p>' +
      '<dl class="pj-dl">' + c.dl.map(function (d) { return '<div><dt>' + d[0] + '</dt><dd>' + d[1] + '</dd></div>'; }).join('') + '</dl></div></article>';
  });
  h += '<div class="pj-cta"><div class="eyebrow">YOUR PROJECT IS NEXT</div><h3 style="margin-top:14px">ทีมเดียวกันนี้ พร้อมออกแบบโครงการถัดไป<br>ของคุณ</h3>' +
    '<p>เล่าไอเดียให้ AI ฟัง แล้วนัดคุยกับสถาปนิกตัวจริงได้ทันที ทั้งบ้าน รีสอร์ต โรงแรม และร้านค้าแบรนด์</p>' +
    '<div class="pj-row"><button class="btn light" type="button" data-open-chat data-chat-msg="สนใจให้ทีม DEBUT ออกแบบโครงการ อยากคุยรายละเอียด">นัดคุยกับทีมออกแบบ</button><a class="btn line" href="#trial">ทดลองใช้สถาปนิกฟรี 30 วัน</a></div>' +
    '<p class="fine">ภาพประกอบเป็นผลงานที่ทีมออกแบบมีส่วนร่วมในบทบาทที่ระบุ ชื่อแบรนด์และเครื่องหมายการค้าเป็นของเจ้าของแต่ละราย</p></div></div></section>';
  why.insertAdjacentHTML("beforebegin", h);
})();
(function () {
  var sec = document.getElementById("projects");
  if (!sec || sec.getAttribute("data-ready")) return;
  sec.setAttribute("data-ready", "1");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chs = sec.querySelectorAll(".pj-ch");
  if ("IntersectionObserver" in window && !reduce) {
    sec.classList.add("js");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.22 });
    chs.forEach(function (c) { io.observe(c); });
    var nums = sec.querySelectorAll("[data-count]");
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        var el = e.target, to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "", t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1600), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
          el.textContent = v.toLocaleString("en-US") + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io2.observe(n); });
  }
  var lb = document.createElement("figure");
  lb.className = "pj-lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "ดูภาพผลงาน");
  lb.innerHTML = '<img alt=""><figcaption></figcaption><button type="button" aria-label="ปิด">×</button>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("figcaption"), last = null;
  function close() { lb.classList.remove("open"); document.documentElement.style.overflow = ""; if (last) last.focus(); }
  lb.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) close(); });
  sec.querySelectorAll("[data-zoom]").forEach(function (f) {
    f.setAttribute("tabindex", "0");
    f.setAttribute("role", "button");
    function open() {
      var im = f.querySelector(".pj-slide.on img.fg") || f.querySelector("img");
      last = f;
      lbImg.src = im.currentSrc || im.src;
      lbImg.alt = im.alt;
      lbCap.textContent = f.getAttribute("data-zoom");
      lb.classList.add("open");
      document.documentElement.style.overflow = "hidden";
      lb.querySelector("button").focus();
    }
    f.addEventListener("click", open);
    f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
})();
(function () {
  // Chapter slideshow: crossfade + slow Ken Burns, progress bar, and the chapter text follows the project of the current slide.
  var fig = document.querySelector(".pj-show");
  if (!fig || fig.getAttribute("data-ready")) return;
  fig.setAttribute("data-ready", "1");
  var slides = fig.querySelectorAll(".pj-slide"), bars = fig.querySelectorAll(".pj-show-bar i");
  var no = fig.querySelector(".pj-show-no"), tag = fig.querySelector(".pj-show-tag");
  var ch = fig.closest(".pj-ch"), text = ch.querySelector(".pj-text");
  var GROUPS = [
    { tag: "Four Seasons Hotel Bangkok at Chao Phraya River", zoom: "FOUR SEASONS HOTEL BANGKOK AT CHAO PHRAYA RIVER" },
    { tag: "Swissôtel Living Jakarta Mega Kuningan", zoom: "SWISSÔTEL LIVING JAKARTA MEGA KUNINGAN" }
  ];
  // Text for each project, taken from the rendered chapter (Four Seasons) and the original Swissôtel chapter data.
  var html = [text.innerHTML, null];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cur = 0, group = 0, timer = 0, paused = false, visible = false, DUR = 4800;
  var total = String(slides.length).padStart(2, "0");

  function swissText() {
    var idx = text.querySelector(".pj-idx b").outerHTML;
    return '<div class="pj-idx">' + idx + ' / 06 · HOSPITALITY INTERIOR</div><h3>Swissôtel Living Jakarta Mega Kuningan</h3><p class="pj-loc">จาการ์ตา อินโดนีเซีย</p>' +
      '<p class="pj-copy">เลานจ์บนตึกสูงที่ฝ้าระแนงไม้ทอดยาวรับวิวเมือง แสงอุ่นและวัสดุธรรมชาติสร้างบรรยากาศแบบ “บ้าน” ให้แขกที่เข้าพักระยะยาว</p>' +
      '<dl class="pj-dl"><div><dt>Year</dt><dd>2018–2022</dd></div><div><dt>Area</dt><dd>5,000 ตร.ม.</dd></div><div><dt>Role</dt><dd>Concept Design</dd></div></dl>';
  }
  function setGroup(g) {
    if (g === group) return;
    group = g;
    if (!html[1]) html[1] = swissText();
    text.classList.add("pj-swap");
    setTimeout(function () { text.innerHTML = html[g]; text.classList.remove("pj-swap"); }, reduce ? 0 : 350);
    tag.textContent = GROUPS[g].tag;
    fig.setAttribute("data-zoom", GROUPS[g].zoom);
  }
  function go(n) {
    slides[cur].classList.remove("on");
    slides[cur].classList.add("off");
    var prev = slides[cur];
    setTimeout(function () { prev.classList.remove("off"); }, 1400);
    cur = (n + slides.length) % slides.length;
    var s = slides[cur];
    s.classList.toggle("alt", cur % 2 === 1);
    s.classList.remove("on"); void s.offsetWidth; s.classList.add("on");
    bars.forEach(function (b, k) { b.classList.toggle("done", k < cur); b.classList.remove("run"); });
    if (!reduce) { void bars[cur].offsetWidth; bars[cur].classList.add("run"); }
    no.textContent = String(cur + 1).padStart(2, "0") + " / " + total;
    setGroup(+s.getAttribute("data-g"));
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    fig.classList.toggle("paused", paused || !visible);
    if (reduce || paused || !visible) return;
    timer = setTimeout(function () { go(cur + 1); }, DUR);
  }
  fig.style.setProperty("--dur", DUR + "ms");
  if (!reduce) bars[0].classList.add("run");
  fig.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); go(cur - 1); });
  fig.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); go(cur + 1); });
  fig.addEventListener("mouseenter", function () { paused = true; schedule(); });
  fig.addEventListener("mouseleave", function () { paused = false; go(cur + 1); });
  var x0 = null;
  fig.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  fig.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { e.preventDefault(); go(cur + (dx < 0 ? 1 : -1)); }
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(fig);
  } else { visible = true; schedule(); }
})();
