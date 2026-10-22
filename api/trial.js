// DEBUT — POST /api/trial  { name, email, phone, project }
// Free 30-day architect trial. Records the sign-up for /admin (type "trial").
// When STRIPE_SECRET_KEY + STRIPE_PRICE_ID are set, creates a Stripe Checkout session
// (subscription with a 30-day trial). The card is entered on Stripe's own page.
const { recordEvent } = require("./_events");
const { parseBody } = require("./_auth");

const TRIAL_DAYS = 30;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host || "debut-ai-platform.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  return proto + "://" + host;
}

async function stripeCheckout(req, d) {
  const key = process.env.STRIPE_SECRET_KEY, price = process.env.STRIPE_PRICE_ID;
  if (!key || !price) return null;
  const base = siteUrl(req);
  const p = new URLSearchParams();
  p.set("mode", "subscription");
  p.set("line_items[0][price]", price);
  p.set("line_items[0][quantity]", "1");
  p.set("subscription_data[trial_period_days]", String(TRIAL_DAYS));
  p.set("payment_method_collection", "always");
  p.set("customer_email", d.email);
  p.set("locale", "th");
  p.set("success_url", base + "/?trial=success");
  p.set("cancel_url", base + "/?trial=cancel#trial");
  p.set("metadata[name]", d.name);
  p.set("metadata[phone]", d.phone);
  p.set("metadata[project]", d.project);
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "content-type": "application/x-www-form-urlencoded" },
    body: p.toString()
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.url) throw new Error("stripe_" + r.status + "_" + ((j.error && j.error.code) || ""));
  return j.url;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const b = parseBody(req);
  const d = {
    name: String(b.name || "").trim().slice(0, 120),
    email: String(b.email || "").trim().slice(0, 200),
    phone: String(b.phone || "").trim().slice(0, 40),
    project: String(b.project || "").trim().slice(0, 300)
  };
  if (!d.name || !EMAIL.test(d.email)) return res.status(400).json({ error: "bad_input" });

  let url = null, stripeError = false;
  try { url = await stripeCheckout(req, d); }
  catch (e) { stripeError = true; console.error("stripe_failed", e && e.message); }

  await recordEvent("trial", Object.assign({}, d, { checkout: url ? "stripe" : "pending" }), "/#trial");
  return res.status(200).json({ ok: true, checkoutUrl: url, stripeError });
};
