const express = require('express');
const mongoose = require('mongoose');

const app = express();

indexRouter = require('./routes/index');

app.use('/', indexRouter);

module.exports = app;
