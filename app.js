'use strict';

const express = require('express');
const app = express();
const {errorHandler} = require('./middlewares');
const routes = require('./routes');
const cors = require('cors');
const logger = require('morgan');

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use('/', routes);
app.use(errorHandler);

module.exports = app;
