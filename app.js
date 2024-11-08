const express = require('express');
var path = require('path');
const mongoose = require('mongoose');

const app = express();

indexRouter = require('./routes/index');

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);

module.exports = app;
