const express = require('express');

const t3 = require('../middleware/tier-3-access');
const {
  createEvent
} = require('../controllers/event-controller');
const { Event } = require('../models/event-model');

const router = new express.Router();

const routerWithSocketIO = function (io) {

  router.post('/', t3, createEvent);

  io.on('connect', function (socket) {

    socket.on('join', async function (eventId, userId) {

      const event = await Event.findById(eventId)
        .populate({ path: 'players.account', select: 'name avatar' });

      if (!userId) {
        socket.emit('bounce', 'You must be logged in to visit event pages.');
      } else if (!event) {
        socket.emit('bounce', 'Could not find an event with that ID.');
      } else if (!event.players.find(function (plr) {
        return plr.account._id.toString() === userId.toString();
      })) {
        socket.emit('bounce', 'You were not invited to this event.');
      } else {

        const player = event.players.find(function (plr) {
          return plr.account._id.toString() === userId.toString();
        });
        player.socketId = socket.id;
        await event.save();

        socket.join(eventId);

        let finished = event.players.every(function (plr) {
          return plr.packs.length + plr.queue.length === 0;
        });

        // the event host needs a way to download a csv file for each other player that contains that player's card pool so trades can be made
        let otherPlayersCardPools = [];
        if (finished && event.host._id.toString() === userId) {
          let otherPlayers = event.players.filter(function (plr) {
            return plr.account._id.toString() !== userId;
          });
          for (let plr of otherPlayers) {
            otherPlayersCardPools.push({
              name: event.players.find(function (x) {
                return x.account._id.toString() === plr.account._id.toString();
              }).name,
              card_pool: plr.card_pool.map(function (card) {
                return card.mtgo_id;
              })
            })
          }
        }

        socket.emit('admittance', 
          finished ?
          {
            players: event.players,
            name: event.name,
            other_players_card_pools: otherPlayersCardPools,
            pack: [],
            card_pool: player.card_pool
          } :
          {
            players: event.players,
            name: event.name,
            pack: (player.queue.length > 0 ? player.queue[0] : [])
          }
        );

      }
  
    });

    socket.on('selectCard', async function (cardId, eventId, userId) {
      try {
        
        const event = await Event.findById(eventId);
        const player = event.players.find(function (plr) {
          return plr.account._id.toString() === userId.toString();
        });
        const cardDrafted = player.queue[0].find(function (crd) {
          return crd._id.toString() === cardId.toString();
        });
        const packMinusCardDrafted = player.queue[0].filter(function (crd) {
          return crd._id !== cardDrafted._id;
        });
        const updatedCardPool = [...player.card_pool, cardDrafted]

        const passRight = player.packs.length % 2 === 0;
        const passLeft = player.packs.length % 2 === 1;
        const playerIndex = event.players.indexOf(player);
        let otherPlayerIndex;
        if (playerIndex === event.players.length - 1 && passRight) {
          otherPlayerIndex = 0;
        } else if (playerIndex === event.players.length - 1 && passLeft) {
          otherPlayerIndex = playerIndex - 1;
        } else if (playerIndex === 0 && passRight) {
          otherPlayerIndex = 1;
        } else if (playerIndex === 0 && passLeft) {
          otherPlayerIndex = event.players.length - 1;
        } else if (passRight) {
          otherPlayerIndex = playerIndex + 1;
        } else {
          otherPlayerIndex = playerIndex - 1;
        }
        
        const otherPlayerUpdatedQueue = packMinusCardDrafted.length > 0 ?
          [...event.players[otherPlayerIndex].queue, packMinusCardDrafted] :
          event.players[otherPlayerIndex].queue;
          
        const updatedQueue = player.queue.length > 1 ? player.queue.slice(1) : [];

        event.players[playerIndex].card_pool = updatedCardPool;
        event.players[playerIndex].queue = updatedQueue;
        event.players[otherPlayerIndex].queue = otherPlayerUpdatedQueue;

        let finished = event.players.every(function (plr) {
          return plr.packs.length + plr.queue.length === 0;
        });

        let nextPack = event.players.every(function (plr) {
          return plr.queue.length === 0 && plr.packs.length > 0;
        });

        if (nextPack) {
          for (plr of event.players) {
            plr.queue.push(plr.packs[0]);
            plr.packs.shift();
          }
        }

        await event.save();

        for (plr of event.players) {
          io.to(plr.socketId).emit('updateEventStatus',
            finished ?
            { pack: [], card_pool: plr.card_pool } :
            { pack: (plr.queue.length > 0 ? plr.queue[0] : []) }
          );
        }

      } catch (error) {
        console.log(error);
      }
    });

    socket.on('leave', async function (eventId, userId) {
      const event = await Event.findById(eventId);
      event.players.find(function (plr) {
        return plr.account._id.toString() === userId.toString();
      }).socketId = undefined;
      await event.save();
    });

  });

  return router;
}

module.exports = routerWithSocketIO;