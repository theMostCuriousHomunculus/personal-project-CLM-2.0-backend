import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, zone } } = args;
  const card = player[zone].find(crd => crd._id.toString() === cardID);

  for (const plr of match.players) {
    if (!card.visibility.includes(plr.account)) card.visibility.push(plr.account);
  }

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};