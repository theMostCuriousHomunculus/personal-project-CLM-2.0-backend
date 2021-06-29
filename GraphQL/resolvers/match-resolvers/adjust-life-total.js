import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { life } = args;

  if (player.life === life) {
    throw new HttpError("Life total did not change.", 400);
  } else if (life > player.life) {
    match.log.push(`${account.name} gained ${life - player.life} life; from ${player.life} up to ${life}.`);
  } else {
    match.log.push(`${account.name} lost ${player.life - life} life; from ${player.life} down to ${life}.`);
  }

  player.life = life;

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};