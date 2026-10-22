// Shared: store a contact event (lead / booking / urgent / trial / video) for /admin and /api/summary, and send alerts.
// Alerts:
//   - Always: one "DEBUT_EVENT" line in the Vercel runtime logs (Vercel → Project → Logs, or a Claude check-in reading them).
//   - Optional: set NOTIFY_WEBHOOK_URL to a Slack / Discord / any JSON webhook to get a message for every contact.
const crypto = require("crypto");
const { pipeline } = require("./_redis");

const MAX_EVENTS = 5000;
const LABEL = { lead: "ลูกค้าขอให้ติดต่อกลับ", booking: "นัดหมายใหม่", urgent: "งานด่วน (Fast-Track)", trial: "สมัครทดลองใช้ 30 วัน", video: "ส่งวิดีโอ AI" };

// Keeps only small, plain values so one request can't flood the database.
function trimObj(o, depth) {
  if (depth > 2 || o == null) return null;
  if (typeof o === "string") return o.slice(0, 1000);
  if (typeof o === "number" || typeof o === "boolean") return o;
  if (typeof o !== "object") return null;
  const out = {};
  for (const k of Object.keys(o).slice(0, 20)) out[String(k).slice(0, 40)] = trimObj(o[k], depth + 1);
  return out;
}

function message(event) {
  const d = event.data || {};
  const lines = ["🔔 DEBUT · " + (LABEL[event.type] || event.type)];
  const add = (k, v) => { if (v) lines.push(k + ": " + String(v).slice(0, 200)); };
  add("ชื่อ", d.name); add("Booking", d.no); add("เวลา", d.when); add("รูปแบบ", d.mode);
  add("อีเมล", d.email); add("โทร", d.phone); add("LINE", d.line); add("WhatsApp", d.whatsapp);
  add("โครงการ", d.project); add("เรื่อง", d.topic || d.message); add("ลิงก์", d.link);
  lines.push("ดูทั้งหมด: " + (process.env.SITE_URL || "https://debut-ai-platform.vercel.app").replace(/\/$/, "") + "/admin");
  return lines.join("\n");
}

async function alertWebhook(text) {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;
  try {
    // "text" is read by Slack and most webhooks, "content" by Discord.
    await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, content: text }) });
  } catch (e) {
    console.error("notify_webhook_failed", e && e.message);
  }
}

// Returns { stored } — stored is false when no database is connected or the write failed.
async function recordEvent(type, data, page) {
  const event = {
    id: Date.now().toString(36) + crypto.randomBytes(3).toString("hex"),
    type: String(type).slice(0, 20),
    data: trimObj(data, 0) || {},
    page: String(page || "").slice(0, 200),
    receivedAt: new Date().toISOString()
  };
  let stored = false;
  try {
    const out = await pipeline([
      ["LPUSH", "debut:events", JSON.stringify(event)],
      ["LTRIM", "debut:events", "0", String(MAX_EVENTS - 1)],
      ["HINCRBY", "debut:counts", event.type, "1"],
      ["HINCRBY", "debut:counts", "total", "1"]
    ]);
    stored = !!out;
  } catch (e) {
    console.error("event_store_failed", e && e.message);
  }
  const text = message(event);
  console.log("DEBUT_EVENT " + JSON.stringify({ id: event.id, type: event.type, page: event.page, stored, at: event.receivedAt }));
  await alertWebhook(text);
  return { stored, event };
}

module.exports = { recordEvent };
