// Shared admin password check (ADMIN_PASSWORD environment variable).
const crypto = require("crypto");

function same(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
const wait = ms => new Promise(r => setTimeout(r, ms));

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  return body && typeof body === "object" ? body : {};
}

async function checkAdmin(body, res) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) { res.status(503).json({ error: "password_not_set" }); return false; }
  const pw = typeof body.password === "string" ? body.password : "";
  if (!pw || !same(pw, secret)) {
    await wait(800);
    res.status(401).json({ error: "wrong_password" });
    return false;
  }
  return true;
}

module.exports = { checkAdmin, parseBody };
