'use strict';

const express = require('express');
const router = express.Router();
const v1Router = require('./v1');
const LinkAPI = require('../api/link');
const slugify = require('slugify');

router.use('/api/v1', v1Router);

if(process.env.NODE_ENV !== 'production'){
  router.use('/test', require('./test'));
}

router.get('/:url', LinkAPI.redirectLink);

module.exports = router;
