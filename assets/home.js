/* DEBUT home page interactions */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var Chat = window.DebuChat;
  var fmt = new Intl.NumberFormat('th-TH');

  /* ---------- mobile menu ---------- */
  var menuBtn = $('menuBtn'), nav = $('nav');
  menuBtn.onclick = function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  nav.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- hero prompt ---------- */
  var heroInput = $('heroPrompt');
  $('heroForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = heroInput.value.trim();
    Chat.open(v || null);
    heroInput.value = '';
  });
  Array.prototype.forEach.call(document.querySelectorAll('.suggest button'), function (b) {
    b.onclick = function () { Chat.open(b.textContent); };
  });
  Chat.mic($('heroMic'), heroInput, $('heroMicNote'));

  /* ---------- hero canvas: drifting drafting lines ---------- */
  var cv = $('heroFlow'), ctx = cv.getContext && cv.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ctx) {
    var W = 0, H = 0, t = 0;
    var resize = function () {
      var r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (var i = 0; i < 14; i++) {
        ctx.strokeStyle = 'rgba(143,139,127,' + (0.08 + (i % 4) * 0.03) + ')';
        ctx.beginPath();
        for (var x = 0; x <= W; x += 16) {
          var y = H * (0.15 + i * 0.06) + Math.sin(x / 180 + t / 90 + i) * 18 + Math.cos(x / 320 - t / 140 + i * 0.7) * 12;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      t++;
      if (!reduce) requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  /* ---------- AI visual concept ---------- */
  var STYLES = [
    { id: 'japandi', label: 'Japandi', line: '#6E5B45', fill: '#D9CDB7', sw: ['#F7F6F1', '#D9CDB7', '#A68B6A', '#4A4036'], mat: 'ไม้โอ๊กอ่อน · ผ้าลินิน · ปูนฉาบขัดมัน' },
    { id: 'tropical', label: 'Tropical Modern', line: '#3F5B3A', fill: '#B9C7A5', sw: ['#F3EFE4', '#B9C7A5', '#7A8F5E', '#3F5B3A'], mat: 'ไม้สัก · หินธรรมชาติ · ชายคายื่นยาว' },
    { id: 'luxury', label: 'Modern Luxury', line: '#2E2E2E', fill: '#C8B07A', sw: ['#F4F1EA', '#C8B07A', '#8F8B7F', '#2E2E2E'], mat: 'หินอ่อน · Brushed Brass · ไม้วีเนียร์' },
    { id: 'minimal', label: 'Minimalist', line: '#4C4C4C', fill: '#E4E1DA', sw: ['#FFFFFF', '#E4E1DA', '#B5B1A8', '#4C4C4C'], mat: 'ผนังขาว · คอนกรีตเปลือย · เหล็กดำ' },
    { id: 'neoclassic', label: 'Neo-Classic', line: '#5A4E44', fill: '#E8DCCB', sw: ['#FAF7F1', '#E8DCCB', '#BFA88A', '#5A4E44'], mat: 'บัวปูนปั้น · พื้นหินอ่อน · ไฟโคมระย้า' },
    { id: 'industrial', label: 'Industrial Loft', line: '#3A3A3A', fill: '#A9694A', sw: ['#EDEAE5', '#A9694A', '#6D6D6D', '#2B2B2B'], mat: 'อิฐเปลือย · เหล็กรูปพรรณ · ไม้เก่า' }
  ];
  var style = STYLES[0];
  var styleBox = $('styles');
  STYLES.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = s.label;
    b.setAttribute('aria-pressed', String(s === style));
    b.onclick = function () {
      Array.prototype.forEach.call(styleBox.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      style = s;
    };
    styleBox.appendChild(b);
  });

  $('upload').addEventListener('change', function () {
    var f = this.files && this.files[0];
    if (!f) return;
    $('uploadLabel').textContent = f.name;
    var img = $('cPhoto');
    if (img.src) URL.revokeObjectURL(img.src);
    img.src = URL.createObjectURL(f);
  });

  $('genBtn').onclick = function () {
    var frame = $('cFrame'), btn = this;
    btn.disabled = true;
    btn.textContent = 'กำลังสร้าง…';
    frame.classList.add('busy');
    setTimeout(function () {
      $('cEmpty').hidden = true;
      $('cPhoto').hidden = !$('cPhoto').src;
      $('cLine').style.stroke = style.line;
      $('cFill').style.fill = style.fill;
      $('cTag').textContent = 'CONCEPT · ' + style.label.toUpperCase();
      var sw = $('cSw');
      sw.querySelectorAll('i').forEach(function (i) { i.remove(); });
      style.sw.forEach(function (c) {
        var i = document.createElement('i');
        i.style.background = c; i.title = c;
        sw.appendChild(i);
      });
      $('cMat').textContent = style.mat;
      frame.classList.remove('busy');
      frame.classList.add('done');
      btn.disabled = false;
      btn.textContent = 'สร้างใหม่อีกครั้ง';
    }, 900);
  };

  /* ---------- rough BOQ estimator (บาท/ตร.ม.) ---------- */
  var TYPES = [
    { id: 'house', label: 'บ้านพักอาศัย', rates: [13000, 18000, 28000] },
    { id: 'renovate', label: 'รีโนเวต', rates: [8000, 12000, 18000] },
    { id: 'office', label: 'ออฟฟิศ', rates: [9000, 15000, 25000] },
    { id: 'retail', label: 'ร้านค้า / Retail', rates: [12000, 20000, 32000] },
    { id: 'hotel', label: 'โรงแรม', rates: [25000, 40000, 65000] },
    { id: 'hospital', label: 'โรงพยาบาล', rates: [35000, 50000, 75000] },
    { id: 'factory', label: 'โรงงาน / คลังสินค้า', rates: [7000, 10000, 15000] }
  ];
  var SPECS = [
    { label: 'Standard', grade: 'ผู้รับเหมาเกรด B · งานมาตรฐาน' },
    { label: 'Premium', grade: 'ผู้รับเหมาเกรด A · งานละเอียด' },
    { label: 'Luxury', grade: 'ผู้รับเหมาเกรด A+ · ช่างฝีมือระดับ Masterpiece' }
  ];
  var boq = { type: TYPES[0], spec: 1 };
  function group(el, items, isCur, onPick) {
    items.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = it.label;
      b.setAttribute('aria-pressed', String(isCur(it, i)));
      b.onclick = function () {
        Array.prototype.forEach.call(el.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onPick(it, i);
        calc();
      };
      el.appendChild(b);
    });
  }
  group($('types'), TYPES, function (it) { return it === boq.type; }, function (it) { boq.type = it; });
  group($('specs'), SPECS, function (it, i) { return i === boq.spec; }, function (it, i) { boq.spec = i; });
  var area = $('area');
  area.addEventListener('input', calc);
  function money(n) {
    return n >= 1e6 ? (n / 1e6).toLocaleString('th-TH', { maximumFractionDigits: 1 }) + ' ล้าน' : fmt.format(Math.round(n));
  }
  function calc() {
    var a = +area.value, rate = boq.type.rates[boq.spec];
    $('areaText').textContent = fmt.format(a);
    var lo = a * rate * 0.9, hi = a * rate * 1.1;
    $('total').textContent = money(lo) + ' – ' + money(hi) + ' บาท';
    $('rate').textContent = fmt.format(rate) + ' บาท';
    $('fee').textContent = money(a * rate * 0.05) + ' – ' + money(a * rate * 0.08) + ' บาท';
    $('grade').textContent = SPECS[boq.spec].grade;
  }
  calc();
  $('boqChat').onclick = function () {
    Chat.open(boq.type.label + ' ' + area.value + ' ตร.ม. สเปก ' + SPECS[boq.spec].label + ' งบประมาณ ' + $('total').textContent);
  };

  /* ---------- dashboard demo ---------- */
  $('approveBtn').onclick = function () {
    this.textContent = 'อนุมัติแล้ว ✓';
    this.disabled = true;
  };

  /* ---------- urgent ---------- */
  $('urgentBtn').onclick = function () {
    $('urgentIdle').hidden = true;
    $('urgentDone').hidden = false;
    $('urgentNo').textContent = 'URGENT TICKET · UR-' + Date.now().toString(36).slice(-6).toUpperCase();
  };

  /* ---------- FAQ ---------- */
  var KB = Chat.kb, list = $('faqList');
  KB.faq.forEach(function (id, n) {
    var e = KB.entries.filter(function (x) { return x.id === id; })[0];
    if (!e) return;
    var d = document.createElement('details');
    if (n === 0) d.open = true;
    d.innerHTML = '<summary><span class="mono">Q' + (n + 1 < 10 ? '0' : '') + (n + 1) + '</span><b></b></summary>' +
      '<div class="faq-a">' + e.a.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>';
    d.querySelector('b').textContent = e.q;
    var more = document.createElement('button');
    more.type = 'button'; more.className = 'link'; more.textContent = 'ถามน้องเดบูต่อ →';
    more.onclick = function () { Chat.ask(id); };
    d.querySelector('.faq-a').appendChild(more);
    list.appendChild(d);
  });
})();
