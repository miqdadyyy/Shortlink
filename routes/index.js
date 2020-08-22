const express = require('express');
const router = express.Router();
const v1Router = require('./v1');
const LinkAPI = require('../api/link');

router.use('/api/v1', v1Router);
router.get('/:url', LinkAPI.redirectLink);

module.exports = router;
