// DEBUT — POST /api/visit  { vid, page }
// Counts a page view for the visitor numbers in /admin and /api/summary.
const { config } = require("./_redis");
const { parseBody } = require("./_auth");
const { recordVisit } = require("./_visitors");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const b = parseBody(req);
  const vid = String(b.vid || "");
  if (!/^[a-z0-9]{8,40}$/.test(vid)) return res.status(400).json({ error: "bad_input" });
  if (!config()) return res.status(204).end();
  try { await recordVisit(vid, String(b.page || "/")); }
  catch (e) { console.error("visit_failed", e && e.message); }
  return res.status(204).end();
};
