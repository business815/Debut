/* DEBU chat — ผู้ช่วยแชตของ DEBUT
   ตอบจาก window.DEBU_KB (assets/debu-kb.js) และพาลูกค้าไปสมัครสมาชิกภายใน ~5 นาที
   ถ้าต้องการส่งข้อมูลสมัคร/นัดหมายไปที่ระบบจริง ให้กำหนด
   window.DEBUT_CONFIG = { leadEndpoint: 'https://...' } ก่อนโหลดไฟล์นี้ */
(function () {
  'use strict';

  var KB = window.DEBU_KB || { entries: [], smalltalk: [], escalate: [], types: [], faq: [] };
  var CONFIG = window.DEBUT_CONFIG || {};
  var SESSION_MS = 5 * 60 * 1000;
  var NUDGE_AFTER = 3;          // เสนอสมัครสมาชิกหลังตอบครบกี่คำถาม
  var WRAP_AT = 4 * 60 * 1000;  // เริ่มปิดการสนทนาเมื่อคุยไปกี่นาที

  var $ = function (id) { return document.getElementById(id); };
  var byId = {};
  KB.entries.forEach(function (e) { byId[e.id] = e; });

  var chat = $('chat'), log = $('log'), quick = $('quick'), form = $('chatForm'), input = $('msg');
  var views = { chat: $('vChat'), book: $('vBook'), ticket: $('vTicket'), join: $('vJoin'), joined: $('vJoined') };
  var titles = {
    chat: ['เดบู · ผู้ช่วยด้านการออกแบบ', 'ออนไลน์ ตอบทันที'],
    book: ['นัดคุยกับสถาปนิก', 'เลือกเวลาที่สะดวก'],
    ticket: ['นัดหมายสำเร็จ', 'เก็บเลข Booking ไว้นะครับ'],
    join: ['สมัครสมาชิก DEBUT', 'ฟรี · ใช้เวลาไม่ถึง 1 นาที'],
    joined: ['ยินดีต้อนรับสู่ DEBUT', 'ที่ปรึกษาจะติดต่อกลับเร็วๆ นี้']
  };

  var state = { started: 0, answered: 0, nudged: false, wrapped: false, welcomed: false, member: null, lastTopic: null };

  /* ---------- storage ---------- */
  function store(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function sendLead(kind, data) {
    var payload = Object.assign({ kind: kind, at: new Date().toISOString(), page: location.href }, data);
    var list = load('debut.leads') || [];
    list.push(payload);
    store('debut.leads', list.slice(-50));
    if (CONFIG.leadEndpoint) {
      try {
        fetch(CONFIG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
      } catch (e) { /* network unavailable */ }
    }
  }
  state.member = load('debut.member');

  /* ---------- views ---------- */
  function show(name) {
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
    $('chatTitle').textContent = titles[name][0];
    $('chatSub').textContent = titles[name][1];
    $('chatBack').hidden = name === 'chat';
  }

  function open(msg) {
    chat.hidden = false;
    $('greet').hidden = true;
    document.body.classList.add('chat-open');
    if (!state.started) state.started = Date.now();
    show('chat');
    if (!state.welcomed) welcome();
    if (msg) setTimeout(function () { handle(msg); }, state.welcomed ? 50 : 600);
    else setTimeout(function () { input.focus(); }, 50);
  }
  function close() {
    chat.hidden = true;
    document.body.classList.remove('chat-open');
  }

  /* ---------- rendering ---------- */
  function bubble(html, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    if (who === 'me') d.textContent = html; else d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function pose(name, hold) {
    document.dispatchEvent(new CustomEvent('debu:pose', { detail: { pose: name, hold: hold } }));
  }
  var POSE_OF = {
    styles: 'present', 'style-japan': 'present', 'style-europe': 'present', 'style-tropical': 'present', 'style-luxury': 'present',
    'style-parametric': 'present', global: 'present', idea: 'sketch', boq: 'sketch', cost: 'sketch', 'design-fee': 'sketch',
    structure: 'site', permit: 'site', renovate: 'site', area: 'site', landscape: 'site', timeline: 'site',
    hotel: 'model', hospital: 'model', mall: 'model', house: 'model', office: 'model', specialist: 'model'
  };

  function typing(cb, len) {
    pose('think');
    var t = bubble('<span class="typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () { t.remove(); pose('idle'); cb(); }, Math.min(1100, 350 + (len || 80) * 2));
  }
  function ctaRow(kinds) {
    var row = document.createElement('div');
    row.className = 'msg-cta';
    kinds.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      if (k === 'join') {
        if (state.member) return;
        b.className = 'btn primary'; b.textContent = 'สมัครสมาชิกฟรี';
        b.onclick = function () { join(); };
      } else if (k === 'book') {
        b.className = 'btn outline'; b.textContent = 'นัดคุยกับสถาปนิก';
        b.onclick = function () { book(); };
      }
      row.appendChild(b);
    });
    if (row.children.length) { log.appendChild(row); log.scrollTop = log.scrollHeight; }
  }
  function chips(ids, extra) {
    quick.innerHTML = '';
    var seen = {};
    (ids || []).forEach(function (id) {
      var e = byId[id];
      if (!e || seen[id]) return;
      seen[id] = 1;
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = e.q;
      b.onclick = function () { ask(e); };
      quick.appendChild(b);
    });
    if (extra !== false && !state.member) {
      var j = document.createElement('button');
      j.type = 'button'; j.className = 'hl'; j.textContent = 'สมัครสมาชิก';
      j.onclick = function () { join(); };
      quick.appendChild(j);
    }
  }

  function say(paras, opts) {
    opts = opts || {};
    var html = (Array.isArray(paras) ? paras : [paras]).map(function (p) { return '<p>' + p + '</p>'; }).join('');
    typing(function () {
      bubble(html, 'bot');
      if (opts.pose) pose(opts.pose, 7000);
      state.answered++;
      var cta = opts.cta ? [opts.cta] : [];
      var elapsed = Date.now() - state.started;
      if (!state.member && !state.wrapped && elapsed >= WRAP_AT && state.answered >= 2) {
        state.wrapped = state.nudged = true;
        setTimeout(wrapUp, 500);
      } else if (!state.member && !state.nudged && state.answered >= NUDGE_AFTER) {
        state.nudged = true;
        setTimeout(nudge, 500);
      } else if (cta.length) {
        ctaRow(cta);
      }
      chips(opts.next);
    }, html.length / 3);
  }

  /* ---------- conversation ---------- */
  function welcome() {
    state.welcomed = true;
    var hi = state.member
      ? 'ยินดีต้อนรับกลับมาครับ คุณ' + esc(state.member.name) + ' วันนี้มีอะไรให้เดบูช่วยครับ?'
      : 'สวัสดีครับ ผม <b>น้องเดบู</b> สถาปนิกตัวน้อยของ DEBUT 👋';
    bubble('<p>' + hi + '</p>', 'bot');
    if (!state.member) {
      bubble('<p>DEBUT คือศูนย์รวมผู้ออกแบบระดับสากลและผู้รับเหมาที่ผ่านการคัดกรองแล้ว เล่าโครงการให้ฟัง หรือเลือกคำถามด้านล่างได้เลย ใช้เวลาไม่เกิน 5 นาทีครับ</p>', 'bot');
    }
    chips(['about', 'guarantee', 'styles', 'specialist', 'member']);
  }

  function nudge() {
    bubble('<div class="nudge"><img src="/assets/debu-avatar.jpg" alt="" width="44" height="44"><p>ดูเหมือนคุณกำลังวางแผนอย่างจริงจังเลยครับ สมัครสมาชิก <b>ฟรี</b> ไว้ก่อน ทีมที่ปรึกษาจะคัด <b>Shortlist ผู้เชี่ยวชาญ</b> ที่ตรงกับโครงการให้ และคุณได้สิทธิ์ <b>ทีมทดแทนทันที</b> หากเกิดปัญหา</p></div>', 'bot');
    ctaRow(['join', 'book']);
  }

  function wrapUp() {
    bubble('<p>สรุปสั้นๆ ครับ กับ DEBUT คุณได้<br>✓ ผู้ออกแบบและผู้รับเหมาที่คัดกรองแล้ว ตรงประเภทอาคารและสไตล์<br>✓ งบโปร่งใสด้วย Smart BOQ และจ่ายเงินตามงวดที่ตรวจแล้ว<br>✓ ทีมทดแทนทันทีหากเกิดข้อผิดพลาด</p><p>ขั้นต่อไปใช้เวลาไม่ถึง 1 นาที สมัครสมาชิกแล้วให้ทีมมืออาชีพดูแลต่อได้เลยครับ</p>', 'bot');
    ctaRow(['join', 'book']);
  }

  function ask(entry) {
    bubble(entry.q, 'me');
    answer(entry);
  }
  function answer(entry) {
    state.lastTopic = entry.id;
    say(entry.a, { next: entry.next, cta: entry.cta, pose: POSE_OF[entry.id] });
  }

  function norm(s) {
    return ' ' + String(s).toLowerCase().replace(/\s+/g, ' ').trim() + ' ';
  }
  function score(text, keys) {
    var s = 0;
    (keys || []).forEach(function (k) { if (text.indexOf(k) !== -1) s += k.length; });
    return s;
  }
  function best(text, list) {
    var top = null, topScore = 0;
    list.forEach(function (e) {
      var s = score(text, e.keys);
      if (s > topScore) { top = e; topScore = s; }
    });
    return top;
  }

  function brief(text, raw) {
    var t = best(text, KB.types || []);
    if (!t) return false;
    var hasNum = /\d/.test(raw);
    if (!hasNum && raw.length < 28) return false;
    var area = raw.match(/(\d[\d,]*)\s*(ตร\.?\s?ม|ตารางเมตร|sqm|m2)/i);
    var rooms = raw.match(/(\d+)\s*(ห้อง|rooms?|keys?)/i);
    var budget = raw.match(/(?:งบ|budget)\s*(\d[\d,.]*)\s*(ล้าน|m|million)?/i);
    var floors = raw.match(/(\d+)\s*ชั้น/);
    var style = best(text, KB.entries.filter(function (e) { return e.id.indexOf('style-') === 0; }));
    var rows = [['ประเภทอาคาร', t.label]];
    if (area) rows.push(['พื้นที่', area[1] + ' ตร.ม.']);
    if (floors) rows.push(['จำนวนชั้น', floors[1] + ' ชั้น']);
    if (rooms) rows.push(['จำนวนห้อง', rooms[1] + ' ห้อง']);
    if (budget) rows.push(['งบประมาณ', budget[1] + (budget[2] ? ' ล้านบาท' : ' บาท')]);
    if (style) rows.push(['สไตล์', style.q.replace(/^สไตล์\s*/, '').split(/\s[(?]/)[0]]);
    var card = '<div class="brief"><span class="eyebrow">AI BRIEF SUMMARY</span>' +
      rows.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div>';
    var entry = byId[t.id];
    typing(function () {
      bubble('<p>เดบูสรุป Brief ของคุณได้แบบนี้ครับ</p>' + card, 'bot');
      say(entry.a.concat(['จากข้อมูลนี้ ทีมสามารถคัด <b>ผู้เชี่ยวชาญเฉพาะด้าน' + t.label + '</b> พร้อมประเมินงบเบื้องต้นให้ได้ทันทีครับ']),
        { next: entry.next.concat(style ? [style.id] : []), cta: 'book', pose: 'sketch' });
    }, 120);
    return true;
  }

  function handle(raw) {
    raw = String(raw || '').trim();
    if (!raw) return;
    bubble(raw, 'me');
    var text = norm(raw);

    if (score(text, KB.escalate) > 0) {
      say(['คำถามนี้ต้องใช้การคำนวณจาก <b>วิศวกรที่มีใบอนุญาต</b> ครับ เพื่อความปลอดภัย เดบูจะไม่เดาตัวเลขให้',
        'ฝากชื่อและเบอร์โทร หรือ LINE ID ไว้ในแบบฟอร์มสมาชิก วิศวกรอาวุโสจะติดต่อกลับพร้อมคำตอบที่ถูกต้องครับ'],
        { next: ['structure', 'permit'], cta: 'join', pose: 'site' });
      return;
    }
    if (brief(text, raw)) return;

    var small = best(text, KB.smalltalk || []);
    var entry = best(text, KB.entries);
    if (entry && (!small || score(text, entry.keys) >= score(text, small.keys))) { answer(entry); return; }
    if (small) { say(small.a, { next: ['about', 'guarantee', 'styles'] }); return; }

    say(['ขอบคุณที่เล่าให้ฟังครับ เรื่องนี้เดบูขอให้ <b>สถาปนิกตัวจริง</b> ช่วยตอบเพื่อความแม่นยำ ระหว่างนี้ลองดูคำถามยอดนิยมด้านล่างได้ครับ'],
      { next: ['about', 'specialist', 'start'], cta: 'book' });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  /* ---------- booking ---------- */
  var bk = { day: null, time: null, mode: 'Google Meet' };
  var TH_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  var TH_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  function pickGroup(el, items, cur, onPick) {
    el.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = it.html || esc(it.label);
      b.setAttribute('aria-pressed', String(it.value === cur));
      b.onclick = function () {
        Array.prototype.forEach.call(el.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onPick(it.value);
      };
      el.appendChild(b);
    });
  }

  function book() {
    show('book');
    var days = [], d = new Date();
    while (days.length < 7) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) days.push(new Date(d));
    }
    $('monthLabel').textContent = TH_MONTHS[days[0].getMonth()] + ' ' + (days[0].getFullYear() + 543);
    pickGroup($('days'), days.map(function (x) {
      return { value: x.toDateString(), html: '<small>' + TH_DAYS[x.getDay()] + '</small><b>' + x.getDate() + '</b>' };
    }), bk.day, function (v) { bk.day = v; sum(); });
    pickGroup($('times'), ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(function (t) { return { value: t, label: t }; }),
      bk.time, function (v) { bk.time = v; sum(); });
    pickGroup($('modes'), [{ value: 'Google Meet', label: 'Google Meet' }, { value: 'สำนักงาน DEBUT', label: 'พบที่สำนักงาน' }],
      bk.mode, function (v) { bk.mode = v; sum(); });
    if (state.member && !$('bEmail').value) $('bEmail').value = state.member.email || '';
    sum();
  }
  function whenText() {
    if (!bk.day) return '';
    var x = new Date(bk.day);
    return TH_DAYS[x.getDay()] + ' ' + x.getDate() + ' ' + TH_MONTHS[x.getMonth()] + (bk.time ? ' · ' + bk.time + ' น.' : '');
  }
  function sum() {
    $('bookSum').textContent = bk.day ? whenText() + ' · ' + bk.mode : 'เลือกวันและเวลาที่สะดวก';
    $('bookErr').hidden = true;
  }
  function ref(prefix) {
    var d = new Date();
    return prefix + '-' + String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-' +
      Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  $('bookConfirm').onclick = function () {
    var email = $('bEmail').value.trim(), err = $('bookErr');
    if (!bk.day || !bk.time) { err.textContent = 'กรุณาเลือกวันและเวลา'; err.hidden = false; return; }
    if (!validEmail(email)) { err.textContent = 'กรุณากรอกอีเมลให้ถูกต้อง'; err.hidden = false; return; }
    var no = ref('DB');
    sendLead('booking', { ref: no, when: whenText(), mode: bk.mode, email: email, member: state.member && state.member.ref });
    $('tNo').textContent = no;
    $('tWhen').textContent = whenText();
    $('tMode').textContent = bk.mode;
    $('tEmail').textContent = email;
    $('tStatus').href = '/status?no=' + encodeURIComponent(no);
    show('ticket');
  };
  $('tBack').onclick = function () {
    show('chat');
    bubble('<p>นัดหมายเรียบร้อยครับ ' + (state.member ? '' : 'อย่าลืมสมัครสมาชิกเพื่อรับสิทธิ์ทีมทดแทนและที่ปรึกษาส่วนตัวด้วยนะครับ') + '</p>', 'bot');
    if (!state.member) ctaRow(['join']);
  };

  /* ---------- membership ---------- */
  var role = 'เจ้าของโครงการ';
  function join() {
    if (state.member) { open(); bubble('<p>คุณเป็นสมาชิก DEBUT แล้วครับ (' + esc(state.member.ref) + ') นัดคุยกับสถาปนิกได้เลย</p>', 'bot'); ctaRow(['book']); return; }
    chat.hidden = false;
    document.body.classList.add('chat-open');
    if (!state.started) state.started = Date.now();
    if (!state.welcomed) welcome();
    show('join');
    pickGroup($('jRole'), ['เจ้าของโครงการ', 'นักออกแบบ', 'ผู้รับเหมา'].map(function (r) { return { value: r, label: r }; }),
      role, function (v) { role = v; });
    setTimeout(function () { $('jName').focus(); }, 50);
  }
  $('joinForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var err = $('joinErr');
    var name = $('jName').value.trim(), phone = $('jPhone').value.trim(), email = $('jEmail').value.trim();
    var fail = !name ? 'กรุณากรอกชื่อ' : !phone ? 'กรุณากรอกเบอร์โทรหรือ LINE ID' : !validEmail(email) ? 'กรุณากรอกอีเมลให้ถูกต้อง' :
      !$('jConsent').checked ? 'กรุณายืนยันการให้ติดต่อกลับ' : '';
    if (fail) { err.textContent = fail; err.hidden = false; return; }
    err.hidden = true;
    var m = { ref: ref('DM'), name: name, phone: phone, email: email, role: role, project: $('jType').value, topic: state.lastTopic };
    state.member = m;
    store('debut.member', m);
    sendLead('membership', m);
    $('mNo').textContent = m.ref;
    $('mName').textContent = name;
    $('mContact').textContent = phone + ' · ' + email;
    quick.innerHTML = '';
    show('joined');
    pose('model', 9000);
  });
  $('mBook').onclick = book;
  $('mBack').onclick = function () {
    show('chat');
    bubble('<p>ยินดีต้อนรับสู่ครอบครัว DEBUT ครับ คุณ' + esc(state.member.name) + ' มีอะไรถามเพิ่มได้ตลอดเลยครับ</p>', 'bot');
    chips(['start', 'timeline', 'styles'], false);
  };

  /* ---------- wiring ---------- */
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = input.value;
    input.value = '';
    handle(v);
  });
  $('chatClose').onclick = close;
  $('chatBack').onclick = function () { show('chat'); };
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !chat.hidden) close(); });
  document.addEventListener('click', function (ev) {
    var o = ev.target.closest('[data-open-chat]');
    if (o) { ev.preventDefault(); open(o.getAttribute('data-chat-msg')); return; }
    var j = ev.target.closest('[data-open-join]');
    if (j) { ev.preventDefault(); join(); }
  });

  if (!load('debut.greeted')) {
    setTimeout(function () { if (chat.hidden) $('greet').hidden = false; }, 4000);
  }
  $('greetClose').onclick = function (ev) { ev.stopPropagation(); $('greet').hidden = true; store('debut.greeted', true); };

  /* ---------- voice input ---------- */
  function mic(btn, field, note, onDone) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!btn) return;
    if (!SR) { btn.addEventListener('click', function () { if (note) note.textContent = 'เบราว์เซอร์นี้ยังไม่รองรับการพูด ลองพิมพ์แทนได้ครับ'; }); return; }
    var rec = null;
    btn.addEventListener('click', function () {
      if (rec) { rec.stop(); return; }
      rec = new SR();
      rec.lang = 'th-TH';
      rec.interimResults = true;
      btn.setAttribute('aria-pressed', 'true');
      if (note) note.textContent = 'กำลังฟัง… พูดได้เลยครับ';
      rec.onresult = function (e) {
        field.value = Array.prototype.map.call(e.results, function (r) { return r[0].transcript; }).join('');
      };
      rec.onerror = function () { if (note) note.textContent = 'ไม่ได้ยินเสียง ลองอีกครั้งหรือพิมพ์แทนได้ครับ'; };
      rec.onend = function () {
        btn.setAttribute('aria-pressed', 'false');
        rec = null;
        if (note && note.textContent.indexOf('กำลังฟัง') === 0) note.textContent = '';
        if (field.value.trim() && onDone) onDone(field.value);
      };
      rec.start();
    });
  }
  mic($('chatMic'), input, null, function (v) { input.value = ''; handle(v); });

  window.DebuChat = { open: open, join: join, book: book, ask: function (id) { if (byId[id]) { open(); ask(byId[id]); } }, mic: mic, kb: KB };
})();
