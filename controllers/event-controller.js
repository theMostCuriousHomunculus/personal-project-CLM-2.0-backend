const { Account } = require('../models/account-model');
const { Cube } = require('../models/cube-model');
const { Event } = require('../models/event-model');

const { asyncArray } = require('../utils/async-array');
const { randomSampleWithoutReplacement } = require('../utils/random-sample-wo-replacement');
const { shuffle } = require('../utils/shuffle');

async function createEvent (req, res) {
  try {
    const cube = await Cube.findById(req.body.cube);
    const cardsPerPack = req.body.cards_per_pack;
    const eventType = req.body.event_type;
    const packsPerPlayer = req.body.packs_per_player;
    let eventCardPool = cube.mainboard;

    cube.modules.forEach(function (module) {
      if (req.body['modules[]'] && req.body['modules[]'].includes(module._id.toString())) {
        eventCardPool = eventCardPool.concat(module.cards);
      }
    });

    cube.rotations.forEach(function (rotation) {
      eventCardPool = eventCardPool.concat(randomSampleWithoutReplacement(rotation.cards, rotation.size));
    });

    shuffle(eventCardPool);

    // creating an initial players array that only contains one player (the user who is creating the event)
    let players = [{ playerId: req.user._id, queue: [], packs: [], card_pool: [] }];

    if (req.body['other_players[]']) {
      req.body['other_players[]'].forEach(function (other_player) {
        players.push({ playerId: other_player, queue: [], packs: [], card_pool: [] });
      });
    }
  
    shuffle(players);
  
    // dish out packs to players if event type is draft
    if (eventType === 'draft') {
      for (let i = 0; i < players.length; i++) {
        players[i].queue.push(eventCardPool.splice(0, cardsPerPack));
        for (let j = 1; j < packsPerPlayer; j++) {
          players[i].packs.push(eventCardPool.splice(0, cardsPerPack));
        }
      }
    } else {
      // dish out cards to players if event type is sealed
      for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < cardsPerPack * packsPerPlayer; j++) {
          players[i].card_pool.push(eventCardPool.pop());
        }
      }
    }

    const event = new Event({
      name: req.body.name,
      hostId: req.user._id,
      players
    });

    await event.save();
    res.status(201).json({ _id: event._id });
  } catch (error) {
    res.status(500).json({ message : error.message });
  }
};

async function fetchEvents (req, res) {
  try{
    const events = await Event.find({ "players.playerId": req.query.playerId }).select('createdAt hostId name');

    // populate the hosts with their names and avatars
    await asyncArray(events, async function (event) {
      const user = await Account.findById(event.hostId);
      event.host_name = user.name;
      event.host_avatar = user.avatar;
    });

    const eventsWithHostInfo = events.map(function (event) {
      return {
        createdAt: event.createdAt,
        host: {
          avatar: event.host_avatar,
          _id: event.hostId,
          name: event.host_name
        },
        _id: event._id,
        name: event.name
      };
    });

    res.status(200).json({ events: eventsWithHostInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  fetchEvents
}