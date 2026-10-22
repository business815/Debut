// DEBUT — GET /api/config
// Public settings for the browser: ad pixel IDs (set META_PIXEL_ID / TIKTOK_PIXEL_ID in Vercel → Settings → Environment Variables).
module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  const id = (v, re) => (re.test(String(v || "").trim()) ? String(v).trim() : "");
  return res.status(200).json({
    metaPixelId: id(process.env.META_PIXEL_ID, /^\d{6,20}$/),
    tiktokPixelId: id(process.env.TIKTOK_PIXEL_ID, /^[A-Z0-9]{8,30}$/i)
  });
};
