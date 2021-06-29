import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, zone } } = args;

  let card;

  if (zone === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
    match.stack = match.stack.filter(crd => crd._id.toString() !== cardID);
  } else if (zone === 'battlefield') {
    card = player[zone].find(crd => crd._id.toString() === cardID);
    player[zone] = player[zone].filter(crd => crd._id.toString() !== cardID);
  } else {
    throw new HttpError("Copies can only exist on the stack or on the battlefield.", 400);
  }

  match.log.push(`${account.name} destroyed his copy/token of ${card.name}.`);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};