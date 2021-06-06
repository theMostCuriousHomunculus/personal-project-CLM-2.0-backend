import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { matchID } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: context.account._id } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID where you are a player.", 404);

  // currently only supporting 2 player games
  match.game_winners = match.game_winners.concat(match.players.filter(plr => plr.account.toString() !== context.account._id.toString()));
  match.log.push(`${context.account.name} has conceded from the game.`)

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};