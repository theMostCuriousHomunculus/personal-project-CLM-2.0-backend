const express = require('express');

const t3 = require('../middleware/tier-3-access');
const { asyncArray } = require('../utils/async-array');
const {
  createEvent,
  fetchEvents
} = require('../controllers/event-controller');
const { Account } = require('../models/account-model');
const { Event } = require('../models/event-model');

const router = new express.Router();

const routerWithSocketIO = function (io) {

  router.get('/', fetchEvents);

  router.post('/', t3, createEvent);

  io.on('connect', function (socket) {

    socket.on('join', async function (eventId, userId) {

      const event = await Event.findById(eventId);

      if (!userId) {
        socket.emit('bounce', 'You must be logged in to visit event pages.');
      } else if (!event) {
        socket.emit('bounce', 'Could not find an event with that ID.');
      } else if (!event.players.find(function (player) {
        return player.player.toString() === userId.toString();
      })) {
        socket.emit('bounce', 'You were not invited to this event.');
      } else {

        const player = event.players.find(function (player) {
          return player.player.toString() === userId.toString();
        });
        player.socketId = socket.id;
        await event.save();

        socket.join(eventId);

        // populate the players with their names and avatars
        await asyncArray(event.players, async function (player) {
          const user = await Account.findById(player.player);
          player.name = user.name;
          player.avatar = user.avatar;
        });

        const displayedPlayersInfo = event.players.map(function (player) {
          return {
            avatar: player.avatar,
            player: player.player,
            name: player.name
          };
        });

        let finished = event.players.every(function (plr) {
          return plr.packs.length + plr.queue.length === 0;
        });

        // the event host needs a way to download a csv file for each other player that contains that player's card pool so trades can be made
        let otherPlayersCardPools = [];
        if (finished && event.host.toString() === userId) {
          let otherPlayers = event.players.filter(function (plr) {
            return plr.player.toString() !== userId;
          });
          for (let plr of otherPlayers) {
            otherPlayersCardPools.push({
              name: displayedPlayersInfo.find(function (x) {
                return x.player.toString() === plr.player.toString();
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
            players: displayedPlayersInfo,
            name: event.name,
            other_players_card_pools: otherPlayersCardPools,
            pack: [],
            card_pool: player.card_pool
          } :
          {
            players: displayedPlayersInfo,
            name: event.name,
            pack: (player.queue.length > 0 ? player.queue[0] : [])
          }
        );

      }
  
    });

    socket.on('selectCard', async function (cardId, eventId, userId) {
      const event = await Event.findById(eventId);

      const player = event.players.find(function (plr) {
        return plr.player.toString() === userId.toString();
      });

      const cardDrafted = player.queue[0].find(function (crd) {
        return crd._id.toString() === cardId.toString();
      });

      player.queue[0].pull(cardDrafted);
      player.card_pool.push(cardDrafted);
      await event.save();
      
      if (player.queue[0].length > 0) {
        if (event.players.indexOf(player) === event.players.length - 1) {
          event.players[0].queue.push(player.queue[0]);
        } else {
          event.players[event.players.indexOf(player) + 1].queue.push(player.queue[0]);
        }
      }
      player.queue.shift();
      await event.save();

      let finished = event.players.every(function (plr) {
        return plr.packs.length + plrr.queue.length === 0;
      });

      let nextPack = event.players.every(function (plr) {
        return plr.queue.length === 0 && plr.packs.length > 0;
      });

      if (nextPack) {
        for (plr of event.players) {
          plr.queue.push(plr.packs[0]);
          plr.packs.shift();
        }
        await event.save();
      }

      for (plr of event.players) {
        io.to(plr.socketId).emit('updateEventStatus',
          finished ?
          { pack: [], card_pool: plr.card_pool } :
          { pack: (plrr.queue.length > 0 ? plr.queue[0] : []) }
        );
      }

    });

    socket.on('leave', async function (eventId, userId) {
      const event = await Event.findById(eventId);
      event.players.find(function (plr) {
        return plr.player.toString() === userId.toString();
      }).socketId = undefined;
      await event.save();
    });

  });

  return router;
}

module.exports = routerWithSocketIO;