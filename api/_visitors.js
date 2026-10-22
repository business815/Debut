// Shared: page-view counters written by /api/visit and read by /api/admin and /api/summary.
// Unique visitors are counted with Redis HyperLogLog on a random browser id (no personal data).
const { pipeline } = require("./_redis");

const DAY_KEEP_SECONDS = 40 * 86400;

// Date in Thailand time, e.g. "2026-10-22".
function bkkDate(ms) { return new Date((ms || Date.now()) + 7 * 3600000).toISOString().slice(0, 10); }

async function recordVisit(vid, page) {
  const day = bkkDate();
  return pipeline([
    ["INCR", "debut:views:total"],
    ["HINCRBY", "debut:views:day", day, "1"],
    ["HINCRBY", "debut:views:page", String(page || "/").slice(0, 60), "1"],
    ["PFADD", "debut:uv:all", vid],
    ["PFADD", "debut:uv:" + day, vid],
    ["EXPIRE", "debut:uv:" + day, String(DAY_KEEP_SECONDS)]
  ]);
}

// { today: { views, unique }, total: { views, unique }, days: [{ date, views }] } for the last 7 days (oldest first).
async function visitorStats() {
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(bkkDate(Date.now() - i * 86400000));
  const today = days[days.length - 1];
  const out = await pipeline([
    ["GET", "debut:views:total"],
    ["PFCOUNT", "debut:uv:all"],
    ["PFCOUNT", "debut:uv:" + today],
    ["HMGET", "debut:views:day"].concat(days)
  ]);
  if (!out) return null;
  const perDay = Array.isArray(out[3]) ? out[3] : [];
  return {
    today: { views: Number(perDay[perDay.length - 1]) || 0, unique: Number(out[2]) || 0 },
    total: { views: Number(out[0]) || 0, unique: Number(out[1]) || 0 },
    days: days.map((date, i) => ({ date, views: Number(perDay[i]) || 0 }))
  };
}

module.exports = { recordVisit, visitorStats, bkkDate };
