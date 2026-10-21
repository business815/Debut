/* DEBU live — ทำให้น้องเดบูดูมีชีวิต: กะพริบตา หายใจ เอียงตามเมาส์ และเปลี่ยนท่าตามบทสนทนา
   ใช้: <span data-debu-live="avatar|full"><img ...></span>
   เปลี่ยนท่า: document.dispatchEvent(new CustomEvent('debu:pose', { detail: 'think' })) */
(function () {
  'use strict';

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // ตำแหน่งตาในแต่ละภาพ (พิกัดพิกเซลของไฟล์ภาพ) และสีผิวเหนือ/ใต้ตา
  var EYES = {
    avatar: { w: 256, h: 256, eyes: [
      { cx: 75.9, cy: 93.7, rx: 11, ry: 13.6, top: '#fcf4e8', bot: '#f6dfca' },
      { cx: 149.3, cy: 100.8, rx: 13, ry: 13.6, top: '#c2a589', bot: '#ae8a69' }
    ] },
    full: { w: 410, h: 490, eyes: [
      { cx: 121.7, cy: 131.7, rx: 15, ry: 19, top: '#f8efe5', bot: '#f1dbc4' },
      { cx: 225, cy: 141.7, rx: 18, ry: 19, top: '#bca186', bot: '#ac8a6c' }
    ] }
  };

  var POSES = {
    idle: '/assets/debu-avatar.jpg',
    sketch: '/assets/debu-1.jpg',
    site: '/assets/debu-2.jpg',
    model: '/assets/debu-3.jpg',
    present: '/assets/debu-4.jpg',
    think: '/assets/debu-5.jpg'
  };

  var uid = 0;
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  // ตาปิด: ยืมผิวหน้าระหว่างดวงตาจากภาพเดียวกันมาปิดลูกตา แล้ววาดเส้นตาหลับ
  function lids(kind, src) {
    var spec = EYES[kind];
    var svg = el('svg', { viewBox: '0 0 ' + spec.w + ' ' + spec.h, preserveAspectRatio: 'xMidYMid slice', class: 'lids', 'aria-hidden': 'true' });
    var defs = el('defs', {});
    svg.appendChild(defs);
    var mid = (spec.eyes[0].cx + spec.eyes[1].cx) / 2;
    spec.eyes.forEach(function (e) {
      var id = 'dl' + (++uid);
      // ขอบนุ่ม: มาสก์ไล่ระดับ ให้ผิวที่ยืมมากลืนกับหน้า
      var soft = el('radialGradient', { id: id + 'g' });
      soft.appendChild(el('stop', { offset: 0.72, 'stop-color': '#fff' }));
      soft.appendChild(el('stop', { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 }));
      var mask = el('mask', { id: id, maskContentUnits: 'userSpaceOnUse' });
      mask.appendChild(el('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx * 1.35, ry: e.ry * 1.35, fill: 'url(#' + id + 'g)' }));
      defs.appendChild(soft);
      defs.appendChild(mask);
      var dx = (e.cx < mid ? -1 : 1) * e.rx * 2.2;
      var g = el('g', { class: 'lid' });
      var skin = el('g', { mask: 'url(#' + id + ')' });
      skin.appendChild(el('image', { href: src, x: dx, y: 0, width: spec.w, height: spec.h, preserveAspectRatio: 'none' }));
      g.appendChild(skin);
      g.appendChild(el('path', {
        d: 'M' + (e.cx - e.rx * 0.85) + ' ' + (e.cy + e.ry * 0.05) + ' Q' + e.cx + ' ' + (e.cy + e.ry * 0.65) + ' ' + (e.cx + e.rx * 0.85) + ' ' + (e.cy + e.ry * 0.05),
        fill: 'none', stroke: '#2a2420', 'stroke-width': Math.max(1.6, e.ry * 0.16), 'stroke-linecap': 'round'
      }));
      svg.appendChild(g);
    });
    return svg;
  }

  function blinkLoop(host) {
    if (reduce) return;
    var next = function () {
      setTimeout(function () {
        if (!document.hidden) {
          host.classList.add('blink');
          setTimeout(function () { host.classList.remove('blink'); }, 170);
          // บางครั้งกะพริบสองครั้งติด
          if (Math.random() < 0.25) setTimeout(function () {
            host.classList.add('blink');
            setTimeout(function () { host.classList.remove('blink'); }, 160);
          }, 320);
        }
        next();
      }, 2600 + Math.random() * 3200);
    };
    next();
  }

  // เอียงตัวตามตำแหน่งเมาส์ ให้รู้สึกมีมิติแบบ 3D
  var tilters = [];
  function tilt(host, max) {
    tilters.push({ host: host, max: max });
  }
  var mx = 0, my = 0, raf = 0;
  function applyTilt() {
    raf = 0;
    tilters.forEach(function (t) {
      var r = t.host.getBoundingClientRect();
      if (!r.width) return;
      var dx = (mx - (r.left + r.width / 2)) / window.innerWidth;
      var dy = (my - (r.top + r.height / 2)) / window.innerHeight;
      var ry = Math.max(-1, Math.min(1, dx * 2)) * t.max;
      var rx = Math.max(-1, Math.min(1, -dy * 2)) * t.max;
      t.host.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      t.host.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      t.host.style.setProperty('--px', (ry * 0.6).toFixed(2) + 'px');
      t.host.style.setProperty('--py', (-rx * 0.6).toFixed(2) + 'px');
    });
  }
  if (!reduce) {
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(applyTilt);
    }, { passive: true });
    // มือถือ Android: เอียงตามการเอียงเครื่อง (iOS ต้องขออนุญาต จึงข้าม)
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        mx = window.innerWidth / 2 + (e.gamma / 30) * window.innerWidth / 2;
        my = window.innerHeight / 2 + ((e.beta - 45) / 30) * window.innerHeight / 2;
        if (!raf) raf = requestAnimationFrame(applyTilt);
      }, { passive: true });
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-debu-live]'), function (host) {
    var kind = host.getAttribute('data-debu-live');
    host.classList.add('debu-live');
    // ภาพและเปลือกตาอยู่ในกล่องเดียวกัน เพื่อให้หายใจและขยับพร้อมกัน
    var body = document.createElement('span');
    body.className = 'debu-body';
    while (host.firstChild) body.appendChild(host.firstChild);
    body.appendChild(lids(kind, body.querySelector('img').getAttribute('src')));
    host.appendChild(body);
    blinkLoop(host);
    tilt(host, kind === 'full' ? 7 : 12);
  });

  // ท่าทางในหัวแชต
  var av = document.querySelector('[data-debu-pose]');
  if (av) {
    var img = av.querySelector('img'), current = 'idle', back = 0;
    Object.keys(POSES).forEach(function (k) { var i = new Image(); i.src = POSES[k]; });
    var setPose = function (name, hold) {
      if (!POSES[name]) name = 'idle';
      clearTimeout(back);
      if (name !== 'idle' && hold) back = setTimeout(function () { setPose('idle'); }, hold);
      if (name === current) return;
      current = name;
      av.classList.add('swap');
      setTimeout(function () {
        img.src = POSES[name];
        av.setAttribute('data-pose', name);
        av.classList.remove('swap');
      }, reduce ? 0 : 160);
    };
    document.addEventListener('debu:pose', function (e) {
      var d = e.detail || {};
      setPose(typeof d === 'string' ? d : d.pose, d.hold);
    });
  }
})();
