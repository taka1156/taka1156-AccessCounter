const router = require('express').Router();
const middleware = require('../../middleware/');
const asyncHandler = require('express-async-handler'); // expressでもasync使いたい

const HEADERS = {
  'content-type': 'image/svg+xml',
  'cache-control': 'max-age=0, no-cache, no-store, must-revalidate',
};

// 簡易的な生死確認
router.get('/', (req, res) => {
  const client = req.query.client;
  if (client === 'gas') {
    res.send('Glitch woke up');
    return;
  }
  res.send('<h1>Server is running</h1>');
});

// 画像返却(閲覧回数)
router.get('/visiter.svg', asyncHandler(async (req, res) => {
    const VISITER_COUNTS_SVG = await middleware.getVisiterCounts();
    res.set(HEADERS);
    res.send(VISITER_COUNTS_SVG);
  })
);

// 画像返却(日付)
router.get('/date.svg', asyncHandler(async (req, res) => {
    const DATE_SVG = middleware.getDate();
    res.set(HEADERS);
    res.send(DATE_SVG);
  })
);

router.get('/github.svg', asyncHandler(async (req, res) => {
    const GITHUB_REPOS_SVG = await middleware.getGithubRepos();
    res.set(HEADERS);
    res.send(GITHUB_REPOS_SVG);
  })
);

module.exports = router;
