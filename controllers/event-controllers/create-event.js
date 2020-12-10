import { Cube } from '../../models/cube-model.js';
import { Event } from '../../models/event-model.js';
import randomSampleWithoutReplacement from '../../utils/random-sample-wo-replacement.js';
import shuffle from '../../utils/shuffle.js';

export default async function (req, res) {
  try {
    const cube = await Cube.findById(req.body.cube);
    const cardsPerPack = req.body.cards_per_pack;
    const eventType = req.body.event_type;
    const packsPerPlayer = req.body.packs_per_player;
    let eventCardPool = cube.mainboard;

    cube.modules.forEach(function (module) {
      if (req.body['modules[]'].includes(module._id.toString())) {
        eventCardPool = eventCardPool.concat(module.cards);
      }
    });

    cube.rotations.forEach(function (rotation) {
      eventCardPool = eventCardPool.concat(randomSampleWithoutReplacement(rotation.cards, rotation.size));
    });

    shuffle(eventCardPool);

    // creating an initial players array that only contains one player (the user who is creating the event)
    let players = [{
      account: req.user._id,
      chaff: [],
      mainboard: [],
      packs: [],
      queue: [],
      sideboard: []
    }];

    req.body['other_players[]'].forEach(function (other_player) {
      players.push({
        account: other_player,
        chaff: [],
        mainboard: [],
        packs: [],
        queue: [],
        sideboard: []
      });
    });
  
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
          players[i].mainboard.push(eventCardPool.pop());
        }
      }
    }

    const event = new Event({
      finished: eventType === 'sealed',
      host: req.user._id,
      name: req.body.name,
      players
    });

    await event.save();
    res.status(201).json({ _id: event._id });
  } catch (error) {
    res.status(500).json({ message : error.message });
  }
};