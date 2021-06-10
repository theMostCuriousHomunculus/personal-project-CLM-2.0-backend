import express from 'express';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import { createServer } from 'http';

import auth from './auth.js';
import graphqlHandler from './GraphQL/GraphQL-handler.js';
import restHandler from './REST/REST-handler.js';

mongoose.connect(process.env.DB_CONNECTION, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

const HTTPserver = createServer(app);
const io = socketio(HTTPserver);

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, CubeID, EventID, MatchID'
  );
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, PATCH, POST');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
app.use(express.urlencoded({
  extended: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}));

app.use(auth);

app.use('/graphql', graphqlHandler);

app.use('/rest', restHandler(io));

app.use(function (req, res, next) {
  res.status(404).send();
});

export default HTTPserver;