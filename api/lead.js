// DEBUT — POST /api/lead
// Receives leads, bookings, urgent requests and AI-video submissions, and stores them for /admin.
const { recordEvent } = require("./_events");
const { parseBody } = require("./_auth");

const TYPES = new Set(["lead", "booking", "urgent", "video"]);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const body = parseBody(req);
  if (!TYPES.has(body.type)) return res.status(400).json({ error: "bad_type" });
  const { stored } = await recordEvent(body.type, body.data, body.page);
  return res.status(200).json({ ok: true, stored });
};
