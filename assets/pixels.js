/* DEBUT — Meta Pixel (Facebook + Instagram) and TikTok Pixel.
   IDs come from /api/config (META_PIXEL_ID / TIKTOK_PIXEL_ID in Vercel). Nothing loads until an ID is set
   and the visitor accepts marketing cookies (PDPA). Other scripts report conversions with window.debutTrack(name). */
(function () {
  "use strict";
  var KEY = "debut-ads-consent";
  // DEBUT event → [Meta standard event, TikTok standard event]
  var MAP = {
    chat: ["Contact", "Contact"],
    lead: ["Lead", "SubmitForm"],
    urgent: ["Lead", "SubmitForm"],
    booking: ["Schedule", "Contact"],
    trial: ["CompleteRegistration", "CompleteRegistration"],
    trial_success: ["StartTrial", "Subscribe"]
  };
  var cfg = null, on = false, pending = [];
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadMeta(id) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id);
    window.fbq("track", "PageView");
  }
  function loadTikTok(id) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e, n) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {}; var s = d.createElement("script"); s.type = "text/javascript"; s.async = !0; s.src = r + "?sdkid=" + e + "&lib=" + t; var f = d.getElementsByTagName("script")[0]; f.parentNode.insertBefore(s, f); };
      ttq.load(id); ttq.page();
    }(window, document, "ttq");
  }

  function fire(name) {
    var m = MAP[name]; if (!m) return;
    var eventID = name + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    if (window.fbq && cfg.metaPixelId) window.fbq("track", m[0], { content_name: name }, { eventID: eventID });
    if (window.ttq && cfg.tiktokPixelId) window.ttq.track(m[1], { content_name: name }, { event_id: eventID });
  }
  window.debutTrack = function (name) { if (on) fire(name); else if (!cfg) pending.push(name); };

  function start() {
    on = true;
    if (cfg.metaPixelId) loadMeta(cfg.metaPixelId);
    if (cfg.tiktokPixelId) loadTikTok(cfg.tiktokPixelId);
    pending.splice(0).forEach(fire);
  }

  function banner() {
    var bar = document.createElement("div");
    bar.className = "ads-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "การใช้คุกกี้");
    bar.innerHTML = "<p>เราใช้คุกกี้เพื่อวัดผลโฆษณาบน Facebook, Instagram และ TikTok และแนะนำบริการที่ตรงกับความสนใจของคุณ</p>" +
      '<div><button class="btn outline" type="button" data-v="no">ไม่ยอมรับ</button><button class="btn primary" type="button" data-v="yes">ยอมรับ</button></div>';
    bar.addEventListener("click", function (e) {
      var v = e.target.getAttribute && e.target.getAttribute("data-v"); if (!v) return;
      set(v); bar.remove();
      if (v === "yes") start(); else pending.length = 0;
    });
    var css = document.createElement("style");
    css.textContent = ".ads-consent{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:90;width:min(640px,calc(100vw - 32px));display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:14px 16px;background:#fff;border:1px solid var(--line,#ddd);box-shadow:0 10px 30px rgba(0,0,0,.12)}" +
      ".ads-consent p{flex:1 1 260px;margin:0;font-size:14px;line-height:1.6;color:var(--ink-2,#333)}.ads-consent div{display:flex;gap:8px}.ads-consent .btn{min-height:40px;padding:0 16px;font-size:14px}";
    document.head.appendChild(css);
    document.body.appendChild(bar);
  }

  fetch("/api/config").then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) {
    cfg = { metaPixelId: j.metaPixelId || "", tiktokPixelId: j.tiktokPixelId || "" };
    if (!cfg.metaPixelId && !cfg.tiktokPixelId) { pending.length = 0; return; }
    var c = get();
    if (c === "yes") start();
    else if (c === "no") pending.length = 0;
    else banner();
  }).catch(function () { cfg = { metaPixelId: "", tiktokPixelId: "" }; pending.length = 0; });
})();
