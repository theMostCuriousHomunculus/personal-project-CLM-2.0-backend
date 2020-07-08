const express = require('express');

const t3 = require('../middleware/tier-3-access');
const {
  createDraft,
  fetchDraft
} = require('../controllers/draft-controller');
const { Draft } = require('../models/draft-model');

const router = new express.Router();

const routerWithSocketIO = function (io) {

  io.on('connect', function (socket) {

    socket.on('join', async function (draftId, userId) {
      socket.join(draftId);

      const draft = await Draft.findById(draftId);

      socket.emit('admittance', { host: draft.host, name: draft.name });
    });

  });

  // router.get('/:draftId', t3, fetchDraft);

  router.post('/', t3, createDraft);

  return router;
}

module.exports = routerWithSocketIO;