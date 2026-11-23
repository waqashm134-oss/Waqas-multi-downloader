const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.get(['/', '/api'], async (req, res) => {
  let url = req.query.url;
  if (!url) return res.json({ status: "Engine is LIVE!" });
  try {
    // 1. Chota vt link ko bara karo
    let finalUrl = url;
    try {
      let r1 = await axios.get(url, { maxRedirects: 5, timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (r1.request?.res?.responseUrl) finalUrl = r1.request.res.responseUrl;
    } catch(e) {}
    console.log('Final URL:', finalUrl);

    // 2. TikWM se video nikalo
    const r = await axios.get('https://www.tikwm.com/api/?url=' + encodeURIComponent(finalUrl), { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    let d = r.data?.data;
    let dl = d?.play || d?.wmplay || d?.hdplay || d?.music;
    if (dl) return res.json({ success: true, download_url: dl, title: d?.title, author: d?.author?.nickname, cover: d?.cover });
    return res.json({ success: false, message: "Video nahi mili", debug: r.data });
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
});

module.exports = app;
