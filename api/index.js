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
  const url = req.query.url;
  if (!url) return res.json({ status: "Engine is LIVE!" });

  // 4 alag API try karenge, jo pehle jawab dega wo jeetega
  const apis = [
    'https://www.tikwm.com/api/?url=' + encodeURIComponent(url),
    'https://api.tikwm.com/api/?url=' + encodeURIComponent(url),
    'https://tikwm.com/api/?url=' + encodeURIComponent(url),
    'https://api.tiklydown.eu.org/api/download?url=' + encodeURIComponent(url)
  ];

  for (let apiUrl of apis) {
    try {
      const r = await axios.get(apiUrl, { timeout: 7000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      let d = r.data?.data || r.data;
      let dl = d?.play || d?.wmplay || d?.hdplay || d?.video?.no_watermark || d?.video?.play || d?.download_url || r.data?.result?.video;
      let title = d?.title || r.data?.result?.title;
      let cover = d?.cover || r.data?.result?.cover;
      let author = d?.author?.nickname || r.data?.result?.author?.nickname;
      if (dl) return res.json({ success: true, download_url: dl, title, author, cover });
    } catch (e) { console.log('Fail:', apiUrl, e.message); continue; }
  }
  return res.json({ success: false, message: "Sab API slow hain, 1 min baad dobara try karo" });
});

module.exports = app;
