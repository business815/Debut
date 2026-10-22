// DEBUT — GET /api/summary?key=NOTIFY_KEY&minutes=65
// Read-only summary of recent contacts for automated check-ins (Claude scheduled task).
const crypto = require("crypto");
const { config, pipeline } = require("./_redis");
const { visitorStats } = require("./_visitors");

function same(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.NOTIFY_KEY;
  const key = (req.query && req.query.key) || "";
  if (!secret) return res.status(503).json({ error: "notify_key_not_set" });
  if (!key || !same(key, secret)) return res.status(401).json({ error: "bad_key" });
  if (!config()) return res.status(200).json({ databaseConnected: false, total: 0, recent: [] });

  const minutes = Math.min(Math.max(parseInt((req.query && req.query.minutes) || "65", 10) || 65, 1), 10080);
  const since = Date.now() - minutes * 60000;
  try {
    const [rows, counts] = await pipeline([["LRANGE", "debut:events", "0", "199"], ["HGETALL", "debut:counts"]]);
    const events = (rows || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
    const recent = events.filter(e => Date.parse(e.receivedAt) >= since);
    const c = {};
    if (Array.isArray(counts)) for (let i = 0; i < counts.length; i += 2) c[counts[i]] = Number(counts[i + 1]) || 0;
    const visitors = await visitorStats();
    return res.status(200).json({ databaseConnected: true, windowMinutes: minutes, newCount: recent.length, counts: c, visitors, recent });
  } catch (e) {
    console.error("summary_failed", e && e.message);
    return res.status(502).json({ error: "database_error" });
  }
};
