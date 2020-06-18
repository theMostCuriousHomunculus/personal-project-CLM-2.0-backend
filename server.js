require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');

const accountRouter = require('./routers/account-router');
const blogRouter = require('./routers/blog-router');
const cubeRouter = require('./routers/cube-router');
const draftRouter = require('./routers/draft-router');

mongoose.connect(process.env.DB_CONNECTION, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const server = express();

server.use(cookieParser());
server.use(express.json());
server.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, PATCH, POST');
  next();
});
server.use(express.urlencoded({
  extended: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}));

server.use('/api/account', accountRouter);
// server.use('/api/blog', blogRouter);
server.use('/api/cube', cubeRouter);
// server.use('/api/draft', draftRouter);

server.listen(port = process.env.PORT || 5000, function () {
    console.log(`Server is up on port ${port}.`);
});