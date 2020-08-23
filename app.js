'use strict';
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const logger = require('morgan');
const {errorHandler, notFoundHandler} = require('./middlewares');

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(express.static('public'));
app.use('/', routes);
app.use([errorHandler, notFoundHandler])

module.exports = app;
