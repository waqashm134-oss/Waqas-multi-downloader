const express = require('express');
const axios = require('axios');
const app = express();

app.get(['/', '/api'], async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ status: "Engine is LIVE!", message: "URL bhejo ?url= ke saath" });
  try {
    const r = await axios.get('https://api.savemedia.io/api/v1/tiktok?url=' + encodeURIComponent(url), { timeout: 15000 });
    let dl = r.data?.data?.video?.play || r.data?.download_url || r.data?.data?.play;
    if (dl) return res.json({ success: true, download_url: dl, data: r.data });
    return res.json({ success: false, message: "Video nahi mili", raw: r.data });
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
});

module.exports = app;
