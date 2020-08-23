'use strict';

const express = require('express');
const router = express.Router();
const linkRouter = require('./link');
const {apiKeyHandler, notFoundHandler, errorHandler} = require('../../middlewares/api');

router.use(apiKeyHandler);
router.use('/link', linkRouter);
router.get('/', (req, res) => {
  res.send({
    message: 'Welcome to version 1 API of this application 🌈'
  });
});
router.use([notFoundHandler, errorHandler]);

module.exports = router;
