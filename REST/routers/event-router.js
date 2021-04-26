import express from 'express';

import createEvent from '../controllers/event-controllers/create-event.js';
import joinEvent from '../controllers/event-controllers/join-event.js';
import leaveEvent from '../controllers/event-controllers/leave-event.js';
import moveCard from '../controllers/event-controllers/move-card.js';
import selectCard from '../controllers/event-controllers/select-card.js';
import sortCard from '../controllers/event-controllers/sort-card.js';
import t3 from '../middleware/tier-3-access.js';

const router = new express.Router();

const routerWithSocketIO = function (io) {

  router.post('/', t3, createEvent);

  io.on('connect', function (socket) {

    socket.on('join', joinEvent.bind({ io, socket }));

    socket.on('moveCard', moveCard.bind({ io, socket }));

    socket.on('selectCard', selectCard.bind({ io, socket }));

    socket.on('sortCard', sortCard.bind({ io, socket }));

    socket.on('leave', leaveEvent.bind({ io, socket }));

  });

  return router;
}

export default routerWithSocketIO;