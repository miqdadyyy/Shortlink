'use strict';

function apiKeyHandler(req, res, next) {
  const key = req.headers.key;
  res.statusCode = 200;
  if (key) {
    if(key === process.env.API_KEY){
      return next();
    } else {
      return res.send({
        statusCode: 401,
        message: 'API Key doesn\'t match ❌'
      });
    }
  } else {
    return res.send({
      statusCode: 401,
      message: 'API Key is not defined ❌'
    });
  }
}

function notFoundHandler(req, res, next){
  if(!req.route){
    res.status(404);
    return res.send({
      statusCode: 404,
      message: `Route ${req.originalUrl} not found ❌`
    });
  }
  next();
}

function errorHandler(err, req, res, next){
  if(err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    return res.send({
      statusCode,
      message: err.message,
      detail: process.env.NODE_ENV === 'production' ? 'Detail can\'t be showed ❌' : err.stack
    });
  }
}

module.exports = {
  apiKeyHandler,
  notFoundHandler,
  errorHandler
}
