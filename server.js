import express from 'express';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import { createServer } from 'http';
import { graphqlHTTP } from 'express-graphql';
import { PubSub } from 'graphql-subscriptions';

import accountRouter from './REST/routers/account-router.js';
import blogRouter from './REST/routers/blog-router.js';
import cubeRouter from './REST/routers/cube-router.js';
import eventRouter from './REST/routers/event-router.js';

import graphqlResolver from './GraphQL/resolvers/root-resolver.js';
import graphqlSchema from './GraphQL/schemas/graphql-schema.js';

mongoose.connect(process.env.DB_CONNECTION, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
const RESTserver = createServer(app);
const io = socketio(RESTserver);

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
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

app.use('/graphql', graphqlHTTP(function (req) {
  return {
    customFormatErrorFn(error) {
      if (!error.originalError) {
        return error;
      } else {
        const data = error.originalError.data;
        const message = error.message;
        const code = error.originalError.code || 500;

        return {
          data,
          message,
          status: code
        };
      }
    },
    graphiql: { subscriptionEndpoint: 'ws://localhost:5001/subscriptions' },
    context: { pubsub: new PubSub(), req },
    rootValue: graphqlResolver,
    schema: graphqlSchema
  }
}));

app.use('/api/account', accountRouter);
app.use('/api/blog', blogRouter);
app.use('/api/cube', cubeRouter);
app.use('/api/event', eventRouter(io));

app.use(function (req, res, next) {
  res.status(404).send();
});

export {
  app,
  RESTserver
};