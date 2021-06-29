import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, zone } } = args;
  const card = player[zone].find(crd => crd._id.toString() === cardID);

  card.visibility = match.players.map(plr => plr.account);
  match.log.push(`${account.name} revealed ${card.name}.`);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};