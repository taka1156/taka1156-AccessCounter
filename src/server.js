const express = require('express');
const axios = require('axios');
const asyncHandler = require('express-async-handler'); // expressでもasync使いたい
const app = express();
const db = require('./tools/db/sqlite.js');
const svg = require('./tools/svg/svgGen.js')
const github = require('./tools/github.js');
require('dotenv').config();

// 簡易的な生死確認
app.get('/', (req, res) => {
  const client = req.query.client
  if (client === 'gas') {
    res.send('Glitch woke up')
    return
  }
  res.send('<h1>Server is running</h1>');
});

// 画像返却(閲覧回数)
app.get('/counter.svg', asyncHandler(async (req, res) => {
    const VIEWER = (await db.read()) + 1; //　閲覧数読み取り
    await db.add(VIEWER); // 更新
    res.set({
      'content-type': 'image/svg+xml',
      'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
    });
    res.send(svg.generateVisiterSvg(VIEWER));
}));

// 画像返却(日付)
app.get('/date.svg', asyncHandler(async (req, res) => {
  const FORMAT_DATE = new Date(new Date()).toLocaleDateString()
  res.set({
    'content-type': 'image/svg+xml',
    'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
  });
  res.send(svg.generateDateSvg(FORMAT_DATE));
}));

app.get('/GithubStatus.svg', asyncHandler(async (req, res) => {
  const GITHUB_ACCOUNT = process.env.GITHUB_ACCOUNT;
  const GITHUB_API = `https://api.github.com/users/${GITHUB_ACCOUNT}/repos`;
  const PARAMS = {
    per_page: 100,
    page: 1,
    client_id: process.env.id,
    client_secret: process.env.secret
  }

  const { data }  = await axios
  .get(GITHUB_API,{ params: PARAMS })
  .catch((e) => {
    console.log(e.message);
  });

  const REPO_LANGS = github.ShapedData(data);

  res.set({
    'content-type': 'image/svg+xml',
    'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
  });
  
  res.send(svg.generateGithubSvg(REPO_LANGS));
}));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('=============== Routers ===============')
  console.log(`[ http://localhost:${listener.address().port} ]`);
  console.log(`[ http://localhost:${listener.address().port}/counter.svg ]`);
  console.log(`[ http://localhost:${listener.address().port}/date.svg ]`);
  console.log(`[ http://localhost:${listener.address().port}/GithubStatus.svg ]`);
  console.log('======================================')
});
