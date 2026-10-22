// DEBUT — POST /api/admin  { password }
const { config, pipeline } = require("./_redis");
const { checkAdmin, parseBody } = require("./_auth");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const body = parseBody(req);
  if (!(await checkAdmin(body, res))) return;

  const stripe = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
  if (!config()) return res.status(200).json({ databaseConnected: false, stripe, counts: {}, events: [] });

  try {
    const [rows, counts] = await pipeline([
      ["LRANGE", "debut:events", "0", "499"],
      ["HGETALL", "debut:counts"]
    ]);
    const events = (rows || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
    const c = {};
    if (Array.isArray(counts)) for (let i = 0; i < counts.length; i += 2) c[counts[i]] = Number(counts[i + 1]) || 0;
    return res.status(200).json({ databaseConnected: true, stripe, counts: c, events });
  } catch (e) {
    console.error("admin_read_failed", e && e.message);
    return res.status(502).json({ error: "database_error" });
  }
};
