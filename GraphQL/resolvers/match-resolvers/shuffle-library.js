import HttpError from '../../../models/http-error.js';
import shuffle from '../../../utils/shuffle.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { matchID, playerID } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const player = match.players.find(plr => plr.account.toString() === playerID);

  // some cards may have become visible to one or more players (perhaps because of a scry)
  for (const card of player.library) {
    card.visibility = [];
  }

  shuffle(player.library);

  // this ensures that, once a player has finished shuffling, any cards that are to be placed at a particular index of their library are
  player.temporary.sort((a, b) => (a.index && b.index) ? a.index - b.index : 0);

  for (const card of player.temporary) {
    if (typeof card.index === "number") {
      player.library = player.library.slice(0, card.index).concat([card]).concat(player.library.slice(card.index));
      card.index = null;
    }
  }

  player.temporary = player.temporary.filter(crd => !player.library.includes(crd));

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};