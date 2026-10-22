// Shared helper for the Upstash Redis database added from the Vercel Marketplace.
// Vercel sets KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN) automatically.
// Files starting with "_" inside /api are not exposed as endpoints.

function config() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

// Runs several Redis commands in one request. Returns an array of results, or null when no database is connected.
async function pipeline(commands) {
  const c = config();
  if (!c) return null;
  const r = await fetch(c.url + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + c.token, "content-type": "application/json" },
    body: JSON.stringify(commands)
  });
  if (!r.ok) throw new Error("redis_http_" + r.status);
  const out = await r.json();
  return out.map(x => (x && x.error ? null : x && x.result));
}

module.exports = { config, pipeline };
