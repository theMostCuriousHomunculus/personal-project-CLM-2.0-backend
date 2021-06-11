import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { energy } = args;

  if (player.energy === energy) {
    throw new HttpError("Energy counters did not change.", 400);
  } else if (energy > player.energy) {
    match.log.push(`${account.name} gained ${energy - player.energy} energy counters; from ${player.energy} up to ${energy}.`);
  } else {
    match.log.push(`${account.name} lost ${player.energy - energy} energy counters; from ${player.energy} down to ${energy}.`);
  }

  player.energy = energy;

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};