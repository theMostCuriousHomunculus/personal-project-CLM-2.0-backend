import express from 'express';

import accountRouter from './routers/account-router.js';
import blogRouter from './routers/blog-router.js';
import cubeRouter from './routers/cube-router.js';
import eventRouter from './routers/event-router.js';

const router = express.Router();

export default function (io) {
  router.use('/account', accountRouter);
  router.use('/blog', blogRouter);
  router.use('/cube', cubeRouter);
  router.use('/event', eventRouter(io));

  return router;
};