import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { playerID, life } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const player = match.players.find(plr => plr.account.toString() === playerID);

  if (player.life === life) throw new HttpError("Life total did not change.", 400);

  const account = await Account.findById(playerID);

  if (life > player.life) {
    match.log.push(`${account.name} gained ${life - player.life} life; from ${player.life} up to ${life}.`);
  } else {
    match.log.push(`${account.name} lost ${player.life - life} life; from ${player.life} down to ${life}.`);
  }

  player.life = life;

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};