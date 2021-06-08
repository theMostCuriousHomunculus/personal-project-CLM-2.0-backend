import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, controllerID, zone } } = args;
  const controller = match.players.find(plr => plr.account.toString() === controllerID);
  let card;
  
  if (zone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
  } else {
    card = controller[zone].find(crd => crd._id.toString() === cardID);
    controller[zone] = controller[zone].filter(crd => crd !== card);
    player[zone].push(card);
  }

  card.controller = account._id;

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};