/* DEBUT — world-class concept gallery + hero background drawings
   All projects and design studios below are fictional examples (concept showcase). */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };

  function P(d) { return '<path d="' + d + '"/>'; }
  function T(d) { return '<path class="t" d="' + d + '"/>'; }
  function F(d) { return '<path class="f" d="' + d + '"/>'; }
  function C(cx, cy, r, c) { return '<circle class="' + (c || "t") + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function E(cx, cy, rx, ry, c) { return '<ellipse class="' + (c || "t") + '" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function R(n, f) { var s = ""; for (var i = 0; i < n; i++) s += f(i); return s; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function arch(x, y, w, h) { var r = w / 2; return P("M" + x + " " + (y + h) + "V" + (y + r) + "A" + r + " " + r + " 0 0 1 " + (x + w) + " " + (y + r) + "V" + (y + h)); }
  function palm(x, base, h) {
    var tx = x - 4, ty = base - h;
    return P("M" + x + " " + base + "Q" + (x + 6) + " " + (base - h / 2) + " " + tx + " " + ty) +
      T("M" + tx + " " + ty + "q-20 -6 -34 6M" + tx + " " + ty + "q20 -8 36 4M" + tx + " " + ty + "q-10 -16 -26 -18M" + tx + " " + ty + "q12 -16 28 -16M" + tx + " " + ty + "q2 14 -4 22");
  }

  var ART = {
    thai: function () {
      var gy = function (x) { return x <= 300 ? 150 - (x - 150) * 2 / 3 : 50 + (x - 300) * 2 / 3; };
      return P("M20 340H580") + T("M60 356H250M300 356H540M100 370H480") +
        R(6, function (i) { return P("M" + (165 + i * 54) + " 240V340"); }) +
        F("M140 230H460V240H140Z") + P("M140 230H460V240H140Z") +
        P("M172 230V148H428V230") + T("M172 170H428") +
        R(9, function (i) { return T("M" + (196 + i * 26) + " 170V230"); }) +
        F("M120 160L300 34L480 160L450 150L300 50L150 150Z") +
        P("M120 160L300 34L480 160") + P("M120 160L104 168M480 160L496 168") + T("M150 150L300 50L450 150") +
        R(7, function (i) { var x = 255 + i * 15; return T("M" + x + " " + r1(gy(x) + 4) + "V148"); }) +
        P("M300 34V16") + T("M219 300Q246 318 273 300") +
        P("M460 240L540 340M476 240L556 340") +
        R(7, function (i) { var t = (i + 1) / 8; return T("M" + r1(460 + 80 * t) + " " + r1(240 + 100 * t) + "h16"); }) +
        P("M548 340V262") + C(548, 236, 34) + C(522, 254, 22) +
        P("M70 340V280") + T("M70 280Q40 270 30 250M70 284Q100 270 112 252M70 290Q50 300 36 296M70 286Q96 296 110 290");
    },
    japan: function () {
      return P("M20 330H580") + F("M110 300H490V312H110Z") + P("M100 290H500") + T("M100 296H500") +
        R(7, function (i) { return P("M" + (120 + i * 60) + " 290V196"); }) + P("M110 196H490") +
        R(6, function (i) { var x = 126 + i * 60; return T("M" + x + " 206H" + (x + 48) + "V286H" + x + "ZM" + (x + 16) + " 206V286M" + (x + 32) + " 206V286M" + x + " 232H" + (x + 48) + "M" + x + " 258H" + (x + 48)); }) +
        F("M70 196L190 96H410L530 196Z") + P("M70 196L190 96H410L530 196Z") + T("M110 164H490M150 130H450") +
        P("M240 96L300 58L360 96") + T("M262 96L300 72L338 96") + P("M232 98H368") +
        E(300, 342, 22, 5) + E(334, 356, 18, 4) + E(298, 370, 20, 4) +
        P("M520 330Q510 280 530 240Q545 215 535 190") + T("M470 250Q500 236 540 246Q560 250 575 244M500 214Q530 200 565 210M480 280Q505 270 525 276") +
        P("M60 330V300M50 300H70M54 300V286H66V300M48 286L60 276L72 286Z");
    },
    resort: function () {
      var villa = function (x, y) { return F("M" + x + " " + y + "h80v16h-80z") + T("M" + (x - 3) + " " + (y - 2) + "h86") + R(4, function (i) { return T("M" + (x + 16 + i * 16) + " " + y + "v16"); }); };
      return C(470, 90, 34) + P("M20 230H580") +
        R(5, function (i) { return T("M" + (40 + i * 20) + " " + (246 + i * 16) + "H" + (560 - i * 30)); }) +
        F("M20 180Q140 120 260 150Q360 170 420 230H20Z") + P("M20 180Q140 120 260 150Q360 170 420 230") +
        villa(40, 160) + villa(140, 140) + villa(240, 156) +
        F("M170 190H450V196H170Z") + P("M170 196H450") + P("M180 230H440") +
        R(8, function (i) { return T("M" + (190 + i * 35) + " 196V230"); }) +
        F("M200 238H470V246H200Z") + T("M220 254H300M330 254H420") +
        palm(110, 230, 80) + palm(505, 230, 92) + palm(540, 230, 70);
    },
    fashion: function () {
      var dummy = function (cx, cy) { return C(cx, cy, 5) + T("M" + cx + " " + (cy + 5) + "L" + (cx - 11) + " " + (cy + 46) + "H" + (cx + 11) + "Z"); };
      return P("M20 350H580") + P("M110 350V60H490V350") + P("M100 60H500") + T("M110 74H490") +
        R(5, function (i) { return arch(126 + i * 72, 90, 52, 74); }) +
        P("M110 176H490") + T("M110 192H490") +
        '<text class="tx" x="300" y="188" text-anchor="middle">MAISON · SILK</text>' +
        F("M250 350V246A50 50 0 0 1 350 246V350Z") + arch(250, 196, 100, 154) + T("M300 254V350") +
        arch(140, 210, 80, 140) + arch(380, 210, 80, 140) +
        dummy(180, 270) + dummy(420, 270) +
        T("M236 350V344H364V350M226 344V338H374V344") + C(124, 336, 12) + C(476, 336, 12);
    },
    wellness: function () {
      return T("M20 170L120 90L200 150L290 70L400 160L480 110L580 170") + P("M20 300H580") +
        P("M60 210Q140 160 220 205Q300 245 380 200Q460 160 540 210") + T("M60 218Q140 170 220 213Q300 253 380 208Q460 170 540 218") +
        R(24, function (i) { return T("M" + (74 + i * 19.5) + " 242V300"); }) + T("M70 240H530") +
        F("M120 316H480V330H120Z") + P("M120 316H480V330H120Z") + E(200, 323, 16, 3) + E(250, 323, 9, 2) +
        T("M380 322q6-10 12 0q6-10 12 0") +
        P("M40 300V240") + C(40, 222, 20) + P("M560 300V230") + C(560, 210, 24);
    },
    flood: function () {
      var waves = "M20 262" + R(28, function () { return "q5 -5 10 0t10 0"; });
      return R(12, function (i) { return T("M" + (60 + i * 45) + " 30l-8 18"); }) +
        P("M20 330H160V372H440V330H580") + T("M164 352H436") +
        '<path class="t d" d="' + waves + '"/>' +
        '<text class="tx" x="24" y="252">FLOOD LEVEL +1.80 M</text>' +
        F("M180 268H420V292H180Z") + P("M180 268H420V292H180Z") +
        P("M200 268V180H400V268") + F("M186 184L300 112L414 184Z") + P("M186 184L300 112L414 184") +
        T("M224 200H274V240H224ZM326 200H376V240H326ZM290 268V214H310V268") +
        P("M168 110V372M432 110V372") + P("M160 276H176M424 276H440") +
        P("M490 320V236M482 246L490 232L498 246") + '<text class="tx" x="502" y="282">+1.80</text>' +
        '<text class="tx" x="214" y="306">AMPHIBIOUS BASE</text>' +
        T("M520 330V290H556V330ZM520 300H556");
    },
    stadium: function () {
      var s = "";
      for (var i = 0; i < 40; i++) {
        var a = i / 40 * Math.PI * 2;
        s += T("M" + r1(300 + 260 * Math.cos(a)) + " " + r1(220 + 86 * Math.sin(a)) + "L" + r1(300 + 196 * Math.cos(a)) + " " + r1(214 + 58 * Math.sin(a)));
      }
      for (var j = 0; j < 31; j++) {
        var b = Math.PI * j / 30, x = r1(300 - 260 * Math.cos(b)), y = r1(220 + 86 * Math.sin(b));
        s += T("M" + x + " " + y + "V" + r1(y + 34));
      }
      return P("M20 360H580") + E(300, 220, 260, 86, "") + E(300, 214, 196, 58) +
        E(300, 218, 140, 38) + E(300, 218, 118, 28, "f") + T("M182 218H418") +
        P("M40 220V254A260 86 0 0 0 560 254V220") + s +
        P("M64 360V296M536 360V296") + T("M64 296h20v12h-20M536 296h20v12h-20") +
        '<text class="tx" x="300" y="152" text-anchor="middle">2048</text>';
    },
    facade: function () {
      var d1 = "", d2 = "";
      for (var i = -18; i <= 12; i++) { var x0 = 200 + i * 20; d1 += "M" + x0 + " 330L" + (x0 + 300) + " 30"; d2 += "M" + x0 + " 30L" + (x0 + 300) + " 330"; }
      return '<defs><clipPath id="cpFacade"><rect x="200" y="30" width="200" height="300"/></clipPath></defs>' +
        P("M20 370H580") + R(15, function (i) { return T("M200 " + (50 + i * 20) + "H400"); }) +
        '<g clip-path="url(#cpFacade)">' + T(d1) + T(d2) + "</g>" +
        P("M200 330V30H400V330") + F("M160 330H440V370H160Z") + P("M160 330H440V370H160Z") + T("M270 370V344H330V370") +
        P("M440 370V250H530V370") + R(5, function (i) { return T("M450 " + (264 + i * 20) + "H520"); }) +
        P("M80 370V320") + C(80, 302, 20) + P("M560 370V330") + C(560, 314, 16);
    },
    mall: function () {
      return P("M20 360H580") + E(300, 90, 250, 34, "") + E(300, 88, 228, 24) +
        R(15, function (i) { return T("M" + (90 + i * 30) + " 74l-10 30"); }) +
        P("M180 120V300M420 120V300") + T("M180 170L146 124M180 170L214 124M420 170L386 124M420 170L454 124") +
        R(5, function (k) { var y = 340 - k * 44, a = 80 + k * 34, b = 520 - k * 34; return F("M" + a + " " + y + "H" + b + "V" + (y + 8) + "H" + a + "Z") + P("M" + a + " " + y + "H" + b) + R(6, function (j) { return C(r1(a + 12 + j * (b - a - 24) / 5), y - 6, 6); }); }) +
        P("M270 340V128M330 340V128") + E(300, 128, 30, 6) +
        P("M520 230Q550 222 580 226") + T("M520 240Q550 232 580 236") +
        T("M106 54h12M112 48v12M494 36h12M500 30v12") + '<text class="tx" x="300" y="384" text-anchor="middle">2066</text>';
    }
  };

  var PROJECTS = [
    { art: "thai", cat: "CONTEMPORARY THAI HOUSE", th: "บ้านไทยร่วมสมัยยกใต้ถุน", name: "Ruen Lom Thun House", loc: "อัมพวา, สมุทรสงคราม", area: "420", firm: "Sala Lumen Atelier", note: "ใต้ถุนสูง 2.4 ม. รับลมจากคลอง หลังคาจั่วทรงไทยตีความใหม่ด้วยกระจกและไม้สัก" },
    { art: "japan", cat: "JAPANESE HERITAGE", th: "บ้านญี่ปุ่นโบราณ (Kominka)", name: "Kura Hinoki Residence", loc: "แม่ริม, เชียงใหม่", area: "380", firm: "Engawa Field Studio", note: "ระเบียงเอ็งกาวะรอบบ้าน ประตูโชจิ ไม้ฮิโนกิ และสวนหินแบบเคียวโตะ" },
    { art: "resort", cat: "5-STAR RESORT", th: "รีสอร์ตระดับ 5 ดาว", name: "Nava Tide Resort & Villas", loc: "อ่าวนาง, กระบี่", area: "28,500", firm: "Tidemark Siam Studio", note: "86 วิลลาไล่ระดับตามเนิน สระอินฟินิตี้มองทะเลอันดามัน" },
    { art: "fashion", cat: "LUXURY FLAGSHIP", th: "แฟล็กชิปสโตร์แบรนด์หรู", name: "Maison Silk Pavilion", loc: "ราชประสงค์, กรุงเทพฯ", area: "1,850", firm: "Velvet Grid Interiors", note: "ซุ้มโค้งสูงสองชั้น ผนังผ้าไหมทอมือ ห้อง VIP Fitting ชั้นบน" },
    { art: "wellness", cat: "WELLNESS CENTER", th: "เวลเนสเซ็นเตอร์", name: "Saeng Arun Wellness Retreat", loc: "เขาใหญ่, นครราชสีมา", area: "6,200", firm: "Breathform Atelier", note: "หลังคาคลื่นรับแสงเช้า สระบัวบำบัด และห้องสปาใต้ระแนงไม้" },
    { art: "flood", cat: "FLOOD-RESILIENT HOME", th: "บ้านอยู่ร่วมกับน้ำท่วม", name: "Floating Ruen Amphibious House", loc: "บางบัวทอง, นนทบุรี", area: "260", firm: "Waterline Habitat Lab", note: "ฐานลอยน้ำยกตัวได้ 1.80 ม. ตามระดับน้ำ เสานำทางกันบ้านลอยออก พร้อมถังเก็บน้ำฝน" },
    { art: "stadium", cat: "OLYMPIC STADIUM", th: "สนามกีฬาโอลิมปิก", name: "Siam Olympic Arena 2048", loc: "EEC, ฉะเชิงเทรา", area: "128,000", firm: "Orbit Span Engineering Studio", note: "60,000 ที่นั่ง หลังคาวงแหวนผลิตไฟฟ้าโซลาร์ ระบายอากาศธรรมชาติ" },
    { art: "facade", cat: "FACADE DESIGN", th: "ออกแบบเปลือกอาคาร", name: "Rattan Skin Tower", loc: "สาทร, กรุงเทพฯ", area: "14,000", unit: "ตร.ม. (ผิวอาคาร)", firm: "Lattice Nine Facade Studio", note: "เปลือกอาคารลายสานหวาย ลดความร้อนเข้าอาคาร 38% ด้วยพาราเมตริกดีไซน์" },
    { art: "mall", cat: "MALL FOR 2066", th: "ห้างสรรพสินค้าแห่งอนาคต", name: "Horizon 2066 Lifestyle Commons", loc: "บางนา, กรุงเทพฯ", area: "210,000", firm: "Next Delta Urban Studio", note: "หลังคาจานลอยผลิตพลังงาน ขั้นบันไดสวนลอยฟ้า รองรับโดรนส่งของ" }
  ];

  function svg(key, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g>' + ART[key]() + "</g></svg>";
  }
  function prepDraw(root) {
    root.querySelectorAll("path,circle,ellipse").forEach(function (n) { n.setAttribute("pathLength", "1"); });
  }

  var grid = $("#worksGrid");
  if (grid) {
    PROJECTS.forEach(function (p, i) {
      var card = document.createElement("article");
      card.className = "work";
      card.innerHTML =
        '<div class="work-art">' + svg(p.art, "draw") + '<span class="work-no mono">' + String(i + 1).padStart(2, "0") + " / 09</span></div>" +
        '<div class="work-body">' +
        '<span class="eyebrow">' + p.cat + "</span>" +
        "<h3>" + p.name + "</h3>" +
        '<span class="work-th">' + p.th + "</span>" +
        '<div class="work-meta"><span>' + p.loc + '</span><span class="num">' + p.area + " " + (p.unit || "ตร.ม.") + "</span></div>" +
        "<p>" + p.note + "</p>" +
        '<div class="work-firm"><span>DESIGN STUDIO</span><b>' + p.firm + "</b><small>Partner of BAUHAUS DESIGN (THAILAND)</small></div>" +
        '<button class="btn ghost-light" type="button" data-open-chat data-chat-msg="สนใจโครงการแบบ ' + p.name + " (" + p.th + ') อยากคุยกับสตูดิโอ ' + p.firm + '">คุยกับสตูดิโอผ่าน DEBUT →</button>' +
        "</div>";
      grid.appendChild(card);
    });
    prepDraw(grid);
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.25 }) : null;
    grid.querySelectorAll(".work").forEach(function (c) { if (io) io.observe(c); else c.classList.add("in"); });
  }

  var bg = $("#heroArt");
  if (bg) {
    var cap = $("#heroArtCap");
    PROJECTS.forEach(function (p, i) {
      var d = document.createElement("div");
      d.className = "hero-slide" + (i === 0 ? " on" : "");
      d.innerHTML = svg(p.art, "draw");
      bg.appendChild(d);
    });
    prepDraw(bg);
    var slides = bg.querySelectorAll(".hero-slide"), cur = 0;
    function caption() { var p = PROJECTS[cur]; if (cap) cap.textContent = "CONCEPT " + String(cur + 1).padStart(2, "0") + " · " + p.name + " · " + p.loc; }
    caption();
    requestAnimationFrame(function () { slides[0].classList.add("in"); });
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setInterval(function () {
      if (document.hidden) return;
      slides[cur].classList.remove("on", "in");
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add("on");
      requestAnimationFrame(function () { requestAnimationFrame(function () { slides[cur].classList.add("in"); }); });
      caption();
    }, 7000);
  }
})();
