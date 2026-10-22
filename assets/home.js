(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var mil = function (n) { return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e8 ? 0 : 1) + " ล้าน" : fmt(n); };

  $("#menuBtn").addEventListener("click", function () {
    var open = $("#nav").classList.toggle("open");
    this.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#nav a").forEach(function (a) { a.addEventListener("click", function () { $("#nav").classList.remove("open"); }); });

  var hp = $("#heroPrompt");
  $("#heroForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = hp.value.trim();
    if (!v) { hp.focus(); return; }
    window.debutAsk(v); hp.value = "";
  });
  document.querySelectorAll(".suggest button").forEach(function (b) { b.addEventListener("click", function () { hp.value = b.textContent; hp.focus(); }); });
  window.debutSetupMic($("#heroMic"), hp, $("#heroMicNote"), null);

  var cv = $("#heroFlow"), ctx = cv.getContext("2d"), phase = 0, raf = 0;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size() { var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.max(1, r.width * d); cv.height = Math.max(1, r.height * d); ctx.setTransform(d, 0, 0, d, 0, 0); draw(); }
  function draw() {
    var W = cv.clientWidth, H = cv.clientHeight; if (!W) return;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1; ctx.strokeStyle = "#B9B9B4";
    for (var i = 0; i < 12; i++) { var t = i / 11; ctx.beginPath(); for (var k = 0; k <= 40; k++) { var u = k / 40, y = u * (H + 60) - 30, x = W * (.55 + .3 * t) + Math.sin(u * Math.PI * 1.3 + t * .9 + phase * .6) * (60 + t * 90) + (t - .5) * 160 * Math.cos(u * Math.PI * .7); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    ctx.lineWidth = 1.1; ctx.strokeStyle = "#FFFFFF";
    for (var j = 0; j < 26; j++) { var s = j / 25; ctx.beginPath(); for (var m = 0; m <= 60; m++) { var v = m / 60, X = v * (W + 60) - 30, a = H * .12 + s * H * .5, Y = H * .35 + Math.sin(v * Math.PI * 1.6 + s * 1.2 + phase) * (a * .45) - Math.cos(v * Math.PI * .9) * (H * .18 - s * H * .12) + (s - .5) * H * .4 * Math.sin(v * Math.PI); m ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
  }
  function loop() { phase += .0035; draw(); raf = requestAnimationFrame(loop); }
  window.addEventListener("resize", size); size();
  if (!still) raf = requestAnimationFrame(loop);
  document.addEventListener("visibilitychange", function () { cancelAnimationFrame(raf); if (!document.hidden && !still) raf = requestAnimationFrame(loop); });

  var STY = {
    tropical: { label: "TROPICAL", bg: "#E4E8DF", line: "#5E6B57", fill: "#9DB08A", sw: ["#5E6B57", "#C8B58E", "#EDE6D6"], mat: "ไม้สัก · หินธรรมชาติ · ชายคายื่นรับลม" },
    luxury: { label: "MODERN LUXURY", bg: "#E6E3DE", line: "#2B2B2B", fill: "#B89A5E", sw: ["#1E1E1E", "#B89A5E", "#EFEAE2"], mat: "หินอ่อน · ทองเหลือง · ไฟซ่อนฝ้า" },
    minimal: { label: "MINIMAL", bg: "#F1F1EF", line: "#6B6B6B", fill: "#D4D4D0", sw: ["#FFFFFF", "#D4D4D0", "#6B6B6B"], mat: "ปูนเปลือย · ไม้อ่อน · ผนังเรียบ" },
    japandi: { label: "JAPANDI", bg: "#ECE6DC", line: "#4A3F35", fill: "#B5A188", sw: ["#4A3F35", "#B5A188", "#F3EEE6"], mat: "ไม้โอ๊ก · ผ้าลินิน · ฉากไม้ระแนง" }
  };
  var style = "tropical", generated = false;
  function renderConcept() {
    var s = STY[style];
    $("#cFrame").style.background = s.bg;
    $("#cLine").setAttribute("stroke", s.line);
    $("#cFill").setAttribute("fill", s.fill);
    $("#cTag").textContent = generated ? "AI CONCEPT · " + s.label : "PREVIEW";
    $("#cEmpty").hidden = generated;
    var sw = $("#cSw"); sw.querySelectorAll("i").forEach(function (n) { n.remove(); });
    s.sw.forEach(function (c) { var i = document.createElement("i"); i.style.background = c; sw.appendChild(i); });
    $("#cMat").textContent = s.mat;
    var box = $("#styles"); box.innerHTML = "";
    Object.keys(STY).forEach(function (k) {
      var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = STY[k].label;
      b.setAttribute("aria-pressed", String(k === style));
      b.addEventListener("click", function () { style = k; generated = false; renderConcept(); });
      box.appendChild(b);
    });
  }
  $("#upload").addEventListener("change", function () {
    var f = this.files && this.files[0]; if (!f) return;
    $("#uploadLabel").textContent = f.name + " · อัปโหลดแล้ว";
    var url = URL.createObjectURL(f); var img = $("#cPhoto"); img.src = url; img.hidden = false;
  });
  $("#genBtn").addEventListener("click", function () {
    var b = this; b.disabled = true; b.textContent = "กำลังสร้างคอนเซปต์…";
    setTimeout(function () { generated = true; renderConcept(); b.disabled = false; b.textContent = "สร้างภาพคอนเซปต์ใหม่"; }, 900);
  });
  renderConcept();

  var TYPES = [{ id: "house", label: "บ้านพักอาศัย", k: 1 }, { id: "shop", label: "อาคารพาณิชย์", k: 1.1 }, { id: "office", label: "สำนักงาน", k: 1.15 }, { id: "hotel", label: "โรงแรม / รีสอร์ต", k: 1.35 }];
  var SPECS = [{ id: "standard", label: "มาตรฐาน", lo: 12000, hi: 18000, grade: "เกรด C–B" }, { id: "good", label: "ดี", lo: 18000, hi: 25000, grade: "เกรด B" }, { id: "premium", label: "พรีเมียม", lo: 25000, hi: 35000, grade: "เกรด A" }];
  var boq = { type: 0, spec: 2 };
  var area = $("#area");
  function renderBoq() {
    var t = TYPES[boq.type], sp = SPECS[boq.spec], a = Number(area.value);
    var lo = sp.lo * t.k, hi = sp.hi * t.k;
    $("#areaText").textContent = fmt(a);
    $("#total").textContent = mil(lo * a) + " – " + mil(hi * a) + " บาท";
    $("#rate").textContent = fmt(lo) + " – " + fmt(hi) + " บาท";
    $("#fee").textContent = mil(lo * a * .05) + " – " + mil(hi * a * .08) + " บาท";
    $("#grade").textContent = sp.grade;
    var tb = $("#types"); tb.innerHTML = "";
    TYPES.forEach(function (x, i) { var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = x.label; b.setAttribute("aria-pressed", String(i === boq.type)); b.addEventListener("click", function () { boq.type = i; renderBoq(); }); tb.appendChild(b); });
    var sb = $("#specs"); sb.innerHTML = "";
    SPECS.forEach(function (x, i) { var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.innerHTML = "<span style='font-weight:500'>" + x.label + "</span><small class='num'>" + fmt(x.lo * t.k) + "–" + fmt(x.hi * t.k) + " บ./ตร.ม.</small>"; b.setAttribute("aria-pressed", String(i === boq.spec)); b.addEventListener("click", function () { boq.spec = i; renderBoq(); }); sb.appendChild(b); });
  }
  area.addEventListener("input", renderBoq);
  renderBoq();
  $("#boqChat").addEventListener("click", function () {
    var t = TYPES[boq.type], sp = SPECS[boq.spec];
    window.debutAsk("อยากทราบราคาและเริ่มงาน " + t.label + " " + fmt(Number(area.value)) + " ตร.ม. สเปก" + sp.label + " ประเมินไว้ " + $("#total").textContent);
  });

  $("#approveBtn").addEventListener("click", function () { this.textContent = "อนุมัติแล้ว"; this.disabled = true; this.style.background = "#2E7D50"; });

  $("#urgentBtn").addEventListener("click", function () {
    var no = "DBT-URG-" + Math.floor(1000 + Math.random() * 9000);
    window.debutNotify("urgent", { ticket: no, source: "homepage-button" });
    $("#urgentIdle").hidden = true; $("#urgentDone").hidden = false;
    $("#urgentNo").textContent = "TICKET " + no + " · HIGH PRIORITY";
  });
})();

(function () {
  if (window.__debutBoot) return; window.__debutBoot = 1;
  var s = document.createElement("script"); s.src = "/assets/boot.js"; document.body.appendChild(s);
})();
