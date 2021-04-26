import Cube from '../../../models/cube-model.js';
import identifyRequester from '../../middleware/identify-requester.js';
import randomSampleWithoutReplacement from '../../../utils/random-sample-wo-replacement.js';
import shuffle from '../../../utils/shuffle.js';
import { Event } from '../../../models/event-model.js';

export default async function (args, req) {
  const { input: { cards_per_pack, cubeID, event_type, name, packs_per_player } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);
  let eventCardPool = cube.mainboard;

  cube.modules.forEach(function (module) {
    if (input['modules[]'].includes(module._id.toString())) {
      eventCardPool = eventCardPool.concat(module.cards);
    }
  });

  cube.rotations.forEach(function (rotation) {
    eventCardPool = eventCardPool.concat(randomSampleWithoutReplacement(rotation.cards, rotation.size));
  });

  shuffle(eventCardPool);

  // creating an initial players array that only contains one player (the user who is creating the event)
  let players = [{
    account: user._id,
    chaff: [],
    mainboard: [],
    packs: [],
    queue: [],
    sideboard: []
  }];

  input['other_players[]'].forEach(function (other_player) {
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
  if (event_type === 'draft') {
    for (let i = 0; i < players.length; i++) {
      players[i].queue.push(eventCardPool.splice(0, cards_per_pack));
      for (let j = 1; j < packs_per_player; j++) {
        players[i].packs.push(eventCardPool.splice(0, cards_per_pack));
      }
    }
  } else {
    // dish out cards to players if event type is sealed
    for (let i = 0; i < players.length; i++) {
      for (let j = 0; j < cards_per_pack * packs_per_player; j++) {
        players[i].mainboard.push(eventCardPool.pop());
      }
    }
  }

  const event = new Event({
    finished: event_type === 'sealed',
    host: user._id,
    name,
    players
  });

  await event.save();
  
  return { _id: event._id };
};