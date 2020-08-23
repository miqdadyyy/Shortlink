'use strict';

const path = require('path');

function errorHandler(err, req, res, next) {
  res.status(500).send('Internal Server Error');
  res.sendFile(path.resolve(__dirname, '../public/500.html'));
}

function notFoundHandler(req, res, next){
  if(!req.route){
    return res.sendFile(path.resolve(__dirname, '../public/404.html'));
  }
  next();
}

module.exports = {
  errorHandler,
  notFoundHandler
};
