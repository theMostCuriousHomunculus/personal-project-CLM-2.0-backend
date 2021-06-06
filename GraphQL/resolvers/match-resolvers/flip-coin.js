import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { matchID } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: context.account._id } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID where you are a player.", 404);

  const result = Math.floor(Math.random() * 2);

  if (result === 0) {
    match.log.push(`${context.account.name} flipped a coin and got TAILS.`);
  } else {
    match.log.push(`${context.account.name} flipped a coin and got HEADS.`);
  }

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};