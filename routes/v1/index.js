const express = require('express');
const router = express.Router();
const linkRouter = require('./link');

router.use('/link', linkRouter);

module.exports = router;
