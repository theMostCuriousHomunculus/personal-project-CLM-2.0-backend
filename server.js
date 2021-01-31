import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import socketio from 'socket.io';

import accountRouter from './routers/account-router.js';
import blogRouter from './routers/blog-router.js';
import cubeRouter from './routers/cube-router.js';
import eventRouter from './routers/event-router.js';

mongoose.connect(process.env.DB_CONNECTION, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, PATCH, POST');
  next();
});
app.use(express.urlencoded({
  extended: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}));

app.use('/api/account', accountRouter);
app.use('/api/blog', blogRouter);
app.use('/api/cube', cubeRouter);
app.use('/api/event', eventRouter(io));

app.use(function (req, res, next) {
  res.status(404).send();
});

export default server;