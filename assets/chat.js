(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var chat = $("#chat");
  if (!chat) return;
  var log = $("#log"), msg = $("#msg"), quick = $("#quick");
  var history = [], busy = false, lastTopic = "";

  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function load(key, d) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function scroll() { log.scrollTop = log.scrollHeight; }

  function notify(type, data) {
    try { fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: type, data: data, page: location.pathname, at: new Date().toISOString() }) }).catch(function () {}); } catch (e) {}
  }
  window.debutNotify = notify;

  var RX = {
    urgent: /ด่วน|เร่งด่วน|urgent|fast.?track|asap/i,
    complex: /โหลด|โครงสร้าง|คาน|เสาเข็ม|ฐานราก|ผังเมือง|กฎหมาย|ระยะร่น|วิศวกร|ขออนุญาต|EIA|structural|zoning/i,
    buying: /ราคา|งบ|เท่าไหร่|เท่าไร|ค่าใช้จ่าย|ค่าออกแบบ|เริ่มงาน|เริ่มได้|ใบเสนอราคา|จ้าง|quotation|budget|price|cost/i
  };
  function detect(t) { if (RX.urgent.test(t)) return "urgent"; if (RX.complex.test(t)) return "complex"; if (RX.buying.test(t)) return "buying"; return ""; }

  function canned(t, intent) {
    if (intent === "urgent") return "รับทราบครับ เรื่องนี้ส่งถึงทีมบริหารโครงการแล้ว ระหว่างนี้เล่าขอบเขตงาน พื้นที่ และวันที่ต้องการเริ่มงานเพิ่มเติมได้เลยครับ";
    if (intent === "complex") return "รายละเอียดในส่วนนี้มีความซับซ้อนและต้องใช้ความเชี่ยวชาญเฉพาะด้าน เพื่อให้ได้ข้อมูลที่แม่นยำที่สุด รบกวนทิ้งเบอร์ติดต่อ, LINE ID หรือ WhatsApp ไว้ให้ทีมสถาปนิกอาวุโสติดต่อกลับครับ";
    if (intent === "buying") return "ประเมินเบื้องต้นครับ\n- สเปกมาตรฐาน ราว 12,000–18,000 บาท/ตร.ม.\n- สเปกดี ราว 18,000–25,000 บาท/ตร.ม.\n- สเปกพรีเมียม ราว 25,000–35,000 บาท/ตร.ม.\n- ค่าออกแบบโดยทั่วไปราว 5–8% ของค่าก่อสร้าง\nตัวเลขจริงขึ้นกับแบบและสเปก แนะนำคุยกับสถาปนิกเพื่อประเมินละเอียดครับ";
    if (/japandi|มินิมอล|minimal|tropical|ทรอปิคอล|luxury|ลักชัวรี/i.test(t)) return "สไตล์นี้เน้นวัสดุธรรมชาติ โทนสีน้อย และแสงธรรมชาติครับ ลองใช้เครื่องมือ AI Concept Generator บนหน้าแรกเพื่อดูโทนสีและวัสดุแนะนำ แล้วส่งให้สถาปนิกต่อได้เลย";
    return "เข้าใจครับ เล่าเพิ่มอีกนิดได้ไหมครับว่าเป็นอาคารประเภทไหน พื้นที่ประมาณกี่ ตร.ม. และอยู่จังหวัดอะไร ผมจะช่วยประเมินงบและแนะนำสถาปนิกที่ตรงงานให้";
  }

  function addMe(text) { log.appendChild(el("div", "m-me", text)); scroll(); }
  function addBot(text, opts) {
    opts = opts || {};
    var wrap = el("div", "m-bot");
    if (opts.tag) { var t = el("span", "m-tag", opts.tag); t.style.background = opts.tagBg || "#111"; wrap.appendChild(t); }
    wrap.appendChild(el("div", "tx", text || ""));
    if (opts.cta) wrap.appendChild(ctaBox());
    if (opts.lead) wrap.appendChild(leadForm());
    log.appendChild(wrap); scroll();
  }
  function typing() { var d = el("div", "typing"); d.setAttribute("aria-label", "เดบูกำลังพิมพ์"); d.innerHTML = "<i></i><i></i><i></i>"; log.appendChild(d); scroll(); return d; }
  function ctaBox() {
    var box = el("div", "cta-box");
    box.appendChild(el("small", "", "พร้อมเริ่มแล้วใช่ไหมครับ"));
    var b = el("button", "btn primary", "ต้องการพูดคุยกับผู้เชี่ยวชาญ/สถาปนิกโดยตรง");
    b.type = "button"; b.addEventListener("click", function () { show("book"); });
    box.appendChild(b); return box;
  }
  var leadSeq = 0;
  function leadForm() {
    var id = "lead" + (++leadSeq);
    var f = el("form", "leadf");
    f.innerHTML = '<span class="eyebrow" style="font-size:10px">SENIOR ARCHITECT CALLBACK</span>' +
      '<label for="' + id + 'p">เบอร์โทร</label><input id="' + id + 'p" type="tel" placeholder="08X-XXX-XXXX" autocomplete="tel">' +
      '<div class="two"><div><label for="' + id + 'l">LINE ID</label><input id="' + id + 'l" type="text"></div>' +
      '<div><label for="' + id + 'w">WhatsApp</label><input id="' + id + 'w" type="text"></div></div>' +
      '<span class="err" style="font-size:13px;color:#A3281C" hidden>กรอกอย่างน้อยหนึ่งช่องทางเพื่อให้ทีมติดต่อกลับได้</span>' +
      '<button class="btn dark" type="submit">ให้ทีมติดต่อกลับ</button>';
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = f.querySelector("#" + id + "p").value.trim(), l = f.querySelector("#" + id + "l").value.trim(), w = f.querySelector("#" + id + "w").value.trim();
      if (!p && !l && !w) { f.querySelector(".err").hidden = false; return; }
      notify("lead", { phone: p, line: l, whatsapp: w, topic: lastTopic });
      f.replaceWith(el("div", "ack", "ได้รับข้อมูลแล้วครับ ทีมสถาปนิกอาวุโสจะติดต่อกลับภายใน 1 วันทำการ"));
    });
    return f;
  }

  function ask(text) {
    text = String(text || "").trim();
    if (!text || busy) return;
    busy = true; lastTopic = text;
    addMe(text);
    var intent = detect(text);
    if (intent === "urgent") notify("urgent", { message: text });
    history.push({ role: "user", content: text });
    history = history.slice(-12);
    var tip = typing();
    $("#chatSub").textContent = "กำลังพิมพ์…";
    var opts = {};
    if (intent === "buying") opts = { tag: "BUYING INTENT", tagBg: "#2438D6", cta: true };
    if (intent === "complex") opts = { tag: "ESCALATION · ต้องใช้ผู้เชี่ยวชาญ", tagBg: "#111111", lead: true };
    if (intent === "urgent") opts = { tag: "URGENT · FAST-TRACK", tagBg: "#C0392B" };
    function finish(answer) {
      tip.remove();
      if (intent === "urgent") answer = "บริษัทได้รับความต้องการเร่งด่วนของท่านแล้ว ทีมบริหารโครงการจะทำการติดต่อกลับภายใน 30 นาที\n\n" + answer;
      addBot(answer, opts);
      history.push({ role: "assistant", content: answer });
      busy = false; $("#chatSub").textContent = "ออนไลน์ ตอบทันที";
    }
    fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history, intent: intent }) })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) { if (!j || !j.text) throw new Error("empty"); finish(j.text); })
      .catch(function () { setTimeout(function () { finish(canned(text, intent)); }, 500); });
  }
  window.debutAsk = function (t) { openChat(); ask(t); };

  function show(v) {
    $("#vChat").hidden = v !== "chat"; $("#vBook").hidden = v !== "book"; $("#vTicket").hidden = v !== "ticket";
    $("#chatBack").hidden = v === "chat";
    $("#chatTitle").textContent = v === "chat" ? "เดบู · ผู้ช่วยด้านการออกแบบ" : v === "book" ? "นัดคุยกับสถาปนิก" : "ใบยืนยันนัดหมาย";
    if (v === "book") renderBook();
  }
  $("#chatBack").addEventListener("click", function () { show("chat"); });
  $("#tBack").addEventListener("click", function () { show("chat"); });

  var DOW = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  var MON = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  var TIMES = ["10:00", "11:30", "14:00", "16:00"];
  var MODES = [{ label: "Google Meet", sub: "ลิงก์ประชุมส่งไปพร้อมอีเมลยืนยัน" }, { label: "นัดพบที่สำนักงาน", sub: "BAUHAUS DESIGN (THAILAND)" }];
  var bk = { day: 0, time: 1, mode: 0 };
  function nextWorkdays(n) { var out = [], d = new Date(); d.setHours(0, 0, 0, 0); while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d)); } return out; }
  var DAYS = nextWorkdays(5);
  function chipList(box, items, key, render) {
    box.innerHTML = "";
    items.forEach(function (it, i) { var b = el("button", "chip"); b.type = "button"; b.setAttribute("aria-pressed", String(bk[key] === i)); render(b, it); b.addEventListener("click", function () { bk[key] = i; renderBook(); }); box.appendChild(b); });
  }
  function whenText() { var d = DAYS[bk.day]; return DOW[d.getDay()] + " " + d.getDate() + " " + MON[d.getMonth()] + " " + d.getFullYear() + " · " + TIMES[bk.time] + " น."; }
  function renderBook() {
    chipList($("#days"), DAYS, "day", function (b, d) { b.innerHTML = "<span style='font-size:12px'>" + DOW[d.getDay()] + "</span><b class='num'>" + d.getDate() + "</b>"; });
    chipList($("#times"), TIMES, "time", function (b, t) { b.textContent = t; b.classList.add("num"); });
    chipList($("#modes"), MODES, "mode", function (b, m) { b.innerHTML = "<span style='font-weight:500'>" + m.label + "</span><small>" + m.sub + "</small>"; });
    $("#monthLabel").textContent = MON[DAYS[0].getMonth()] + " " + DAYS[0].getFullYear();
    $("#bookSum").textContent = whenText() + " · " + MODES[bk.mode].label;
  }
  $("#bookConfirm").addEventListener("click", function () {
    var email = $("#bEmail").value.trim(), err = $("#bookErr");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = "กรอกอีเมลให้ถูกต้องเพื่อรับใบยืนยันนัดหมาย"; err.hidden = false; $("#bEmail").focus(); return; }
    err.hidden = true;
    var d = DAYS[bk.day];
    var no = "DBT-" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + String(Math.floor(1000 + Math.random() * 9000));
    var booking = { no: no, when: whenText(), mode: MODES[bk.mode].label, email: email, topic: lastTopic, createdAt: new Date().toISOString() };
    var all = load("debut-bookings", []); all.unshift(booking); store("debut-bookings", all.slice(0, 20));
    notify("booking", booking);
    $("#tNo").textContent = no; $("#tWhen").textContent = booking.when; $("#tMode").textContent = booking.mode; $("#tEmail").textContent = email;
    $("#tStatus").href = "/status#" + no;
    show("ticket");
  });

  function setupMic(btn, input, note, onDone) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!btn) return;
    if (!SR) { btn.addEventListener("click", function () { if (note) note.textContent = "เบราว์เซอร์นี้ยังไม่รองรับการพูด ลองใช้ Chrome หรือพิมพ์แทนได้ครับ"; else input.placeholder = "เบราว์เซอร์นี้ยังไม่รองรับการพูด"; }); return; }
    var rec = null;
    btn.addEventListener("click", function () {
      if (rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = "th-TH"; rec.interimResults = true; rec.continuous = false;
      btn.setAttribute("aria-pressed", "true");
      if (note) note.textContent = "กำลังฟัง… พูดความต้องการได้เลย แตะไมค์อีกครั้งเพื่อหยุด";
      rec.onresult = function (e) { var t = ""; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; input.value = t; };
      rec.onerror = function () { if (note) note.textContent = "ไม่ได้ยินเสียง หรือยังไม่ได้อนุญาตไมโครโฟน ลองอีกครั้งได้ครับ"; };
      rec.onend = function () { btn.setAttribute("aria-pressed", "false"); rec = null; if (note && /กำลังฟัง/.test(note.textContent)) note.textContent = ""; if (input.value.trim() && onDone) onDone(); };
      rec.start();
    });
  }
  window.debutSetupMic = setupMic;
  setupMic($("#chatMic"), msg, null, null);

  var launch = $("#launch");
  function openChat(text) {
    chat.hidden = false; launch.hidden = true;
    store("debut-greeted", true);
    if (!log.childElementCount) greet();
    if (text) ask(text); else setTimeout(function () { msg.focus(); }, 50);
  }
  window.debutOpenChat = openChat;
  function closeChat() { chat.hidden = true; launch.hidden = false; $("#greet").hidden = true; }
  $("#chatClose").addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !chat.hidden) closeChat(); });
  document.addEventListener("click", function (e) { var t = e.target.closest("[data-open-chat]"); if (!t) return; e.preventDefault(); openChat(t.getAttribute("data-chat-msg") || ""); });

  function greet() { addBot('สวัสดีครับ ผม "เดบู" ผู้ช่วยด้านการออกแบบของ DEBUT\nเล่าโปรเจกต์ ถามเรื่องงบ วัสดุ หรือหาสถาปนิกที่ใช่ได้เลยครับ'); }
  ["อยากทราบราคา บ้าน 2 ชั้น 250 ตร.ม.", "คำนวณโหลดคานยื่น 6 เมตรได้ไหม", "ด่วน! ต้องเริ่มงานเดือนหน้า", "ไอเดียห้องนั่งเล่นสไตล์ Japandi"].forEach(function (q) { var b = el("button", "", q); b.type = "button"; b.addEventListener("click", function () { ask(q); }); quick.appendChild(b); });
  $("#chatForm").addEventListener("submit", function (e) { e.preventDefault(); var v = msg.value; msg.value = ""; ask(v); });

  $("#greetClose").addEventListener("click", function () { $("#greet").hidden = true; });
  if (!load("debut-greeted", false)) setTimeout(function () { if (chat.hidden) $("#greet").hidden = false; }, 1000);
})();
