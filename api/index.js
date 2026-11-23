const express = require('express');
const axios = require('axios');
const app = express();

app.get(['/', '/api'], async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ status: "Engine is LIVE!" });
  try {
    const r = await axios.get('https://www.tikwm.com/api/?url=' + encodeURIComponent(url), { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    let d = r.data?.data;
    let dl = d?.play || d?.wmplay || d?.music;
    if (dl) return res.json({ success: true, download_url: dl, title: d?.title, author: d?.author?.nickname, cover: d?.cover });
    return res.json({ success: false, message: "Video nahi mili", raw: r.data });
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
});

module.exports = app;
