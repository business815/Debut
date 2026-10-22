// DEBUT — /api/media
// GET  -> public list of AI videos shown in the DEBUT FILMS pop-up.
// POST -> { password, action: "add" | "remove" | "list", item | id }  (admin only)
const crypto = require("crypto");
const { config, pipeline } = require("./_redis");
const { checkAdmin, parseBody } = require("./_auth");

const KEY = "debut:media";
const CATS = new Set(["film", "mc"]);

function classify(raw) {
  let u;
  try { u = new URL(String(raw || "").trim()); } catch (e) { return null; }
  if (u.protocol !== "https:") return null;
  const h = u.hostname.replace(/^www\.|^m\./, "");
  if (h === "youtu.be") { const id = u.pathname.slice(1).split("/")[0]; return /^[\w-]{6,20}$/.test(id) ? { kind: "youtube", ref: id } : null; }
  if (h === "youtube.com" || h === "youtube-nocookie.com") {
    let id = u.searchParams.get("v");
    if (!id) { const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,20})/); id = m && m[1]; }
    return id && /^[\w-]{6,20}$/.test(id) ? { kind: "youtube", ref: id } : null;
  }
  if (h === "vimeo.com" || h === "player.vimeo.com") { const m = u.pathname.match(/(\d{6,12})/); return m ? { kind: "vimeo", ref: m[1] } : null; }
  if (/\.(mp4|webm|mov|m4v)$/i.test(u.pathname)) return { kind: "file", ref: u.toString() };
  return null;
}

async function list() {
  const [rows] = await pipeline([["LRANGE", KEY, "0", "99"]]);
  return (rows || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=30, stale-while-revalidate=300");
    if (!config()) return res.status(200).json({ items: [] });
    try { return res.status(200).json({ items: await list() }); }
    catch (e) { console.error("media_list_failed", e && e.message); return res.status(200).json({ items: [] }); }
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  res.setHeader("Cache-Control", "no-store");
  const body = parseBody(req);
  if (!(await checkAdmin(body, res))) return;
  if (!config()) return res.status(503).json({ error: "database_not_connected" });

  try {
    if (body.action === "add") {
      const it = body.item || {};
      const cat = CATS.has(it.cat) ? it.cat : null;
      const title = String(it.title || "").trim().slice(0, 120);
      const v = classify(it.url);
      if (!cat || !title) return res.status(400).json({ error: "bad_input" });
      if (!v) return res.status(400).json({ error: "unsupported_url" });
      const item = { id: Date.now().toString(36) + crypto.randomBytes(2).toString("hex"), cat, title, url: String(it.url).trim(), kind: v.kind, ref: v.ref, addedAt: new Date().toISOString() };
      await pipeline([["LPUSH", KEY, JSON.stringify(item)], ["LTRIM", KEY, "0", "99"]]);
      return res.status(200).json({ ok: true, items: await list() });
    }
    if (body.action === "remove") {
      const [rows] = await pipeline([["LRANGE", KEY, "0", "99"]]);
      const hit = (rows || []).find(s => { try { return JSON.parse(s).id === body.id; } catch (e) { return false; } });
      if (hit) await pipeline([["LREM", KEY, "1", hit]]);
      return res.status(200).json({ ok: true, items: await list() });
    }
    if (body.action === "list") return res.status(200).json({ ok: true, items: await list() });
    return res.status(400).json({ error: "bad_action" });
  } catch (e) {
    console.error("media_failed", e && e.message);
    return res.status(502).json({ error: "database_error" });
  }
};
