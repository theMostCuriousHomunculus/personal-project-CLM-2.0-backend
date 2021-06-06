import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { cardID, destination, index, matchID, origin, playerID, reveal, shuffle } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const player = match.players.find(plr => plr.account.toString() === playerID);
  const card = player[origin].find(crd => crd._id.toString() === cardID);

  if (reveal) {
    for (const plr of match.players) {
      if (!card.visibility.includes(plr.account)) card.visibility.push(plr.account);
    }
  }

  player[origin] = player[origin].filter(crd => crd !== card);

  // note that this resolver does not actually shuffle the library.  it is up to one of the players to send a separate request to shuffle the library.
  if (destination === "library" && !shuffle) {
    // think scrying or aethergust
    player.library = player.library.slice(0, index).concat([card]).concat(player.library.slice(index));
  } else if (destination === "library" && shuffle && typeof index === "number") {
    // think vampiric tutor
    card.index = index;
    player.temporary.push(card);
  } else {
    // if destination is library, a shuffle is needed but no index is provided OR if the destination is not the library then the card can just be pushed into the destination zone
    player[destination].push(card);
  }

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};