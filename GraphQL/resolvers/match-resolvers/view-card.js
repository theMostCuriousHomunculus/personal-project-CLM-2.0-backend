import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { cardID, matchID, playerID, zone } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const player = match.players.find(plr => plr.account.toString() === playerID);
  const card = player[zone].find(crd => crd._id.toString() === cardID);

  if (!card.visibility.includes(context.account._id)) card.visibility.push(context.account._id);

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};