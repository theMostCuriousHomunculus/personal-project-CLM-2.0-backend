import HttpError from '../../../models/http-error.js';
import { Event } from '../../../models/event-model.js';
import Match from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  const { account } = context;

  if (!account) throw new HttpError("You must be logged in to create a match.", 401);
  
  const { input: { eventID, playerIDs } } = args;
  const event = await Event.findById(eventID);
  const matchInfo = {
    cube: event.cube,
    event: event._id,
    game_winners: [],
    log: [],
    players: [],
    stack: []
  };

  for (const player of event.players) {
    if (playerIDs.includes(player.account.toString())) {
      const plr = {
        account: player.account,
        battlefield: [],
        energy: 0,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: 20,
        mainboard: [],
        poison: 0,
        sideboard: [],
        temporary: []
      };

      for (const card of player.mainboard) {
        plr.mainboard.push({
          back_image: card.back_image,
          cmc: card.cmc,
          controller: player.account,
          counters: {},
          flipped: false,
          image: card.image,
          isCopyToken: false,
          name: card.name,
          owner: player.account,
          sideboarded: false,
          tapped: false,
          targets: [],
          tokens: [],
          visibility: [player.account],
          x_coordinate: 0,
          y_coordinate: 0,
          z_index: 0
        });
      }

      for (const card of player.sideboard) {
        plr.sideboard.push({
          back_image: card.back_image,
          cmc: card.cmc,
          controller: player.account,
          counters: {},
          flipped: false,
          image: card.image,
          isCopyToken: false,
          name: card.name,
          owner: player.account,
          sideboarded: true,
          tapped: false,
          targets: [],
          tokens: [],
          visibility: [player.account],
          x_coordinate: 0,
          y_coordinate: 0,
          z_index: 0
        });
      }

      matchInfo.players.push(plr);
    }
  }

  const match = new Match(matchInfo);
  await match.save();

  return match;
};