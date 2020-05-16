const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const postRouter = require('./routes/posts');
const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/db_post', {useNewUrlParser: true})
  .then(() => {
    console.log('Connected');
  })
  .catch(() => {
    console.log('Connected fail')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use('/api/posts', postRouter);

module.exports = app;
