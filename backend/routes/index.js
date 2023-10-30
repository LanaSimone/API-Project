// backend/routes/index.js
const express = require('express');
const router = express.Router();


// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

  const apiRouter = require('./api');
  router.use('/api', apiRouter);

  const spotsRouter = require('./api/spots');
  router.use('/api/spots', spotsRouter);

  // const spotsRouter = require('./api/spots');
  // router.use('/api/spots', spotsRouter);

  // const spotsRouter = require('./api/spots');
  // router.use('/api/spots', spotsRouter);

module.exports = router;
