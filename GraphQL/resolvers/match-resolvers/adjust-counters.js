import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, controllerID, counterAmount, counterType, zone } } = args;
  const controller = match.players.find(plr => plr.account.toString() === controllerID);

  if (!controller) throw new HttpError("Invalid controllerID.", 404);

  let card;
  
  if (zone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
  } else {
    card = controller[zone].find(crd => crd._id.toString() === cardID);
  }

  const counterObject = card.counters.find(obj => obj.counterType === counterType);

  if (!counterObject) {
    card.counters.push({ counterAmount, counterType });
  } else if (counterAmount > counterObject.counterAmount) {
    match.log.push(`${account.name} added ${counterAmount - counterObject.counterAmount} ${counterType} counters to ${card.name}; from ${counterObject.counterAmount} to ${counterAmount}.`);
  } else if (counterAmount < counterObject.counterAmount) {
    match.log.push(`${account.name} removed ${counterObject.counterAmount - counterAmount} ${counterType} counters from ${card.name}; from ${counterObject.counterAmount} to ${counterAmount}.`);
  } else {
    throw new HttpError(`Amount of ${counterType} counters did not change.`, 400);
  }

  counterObject.counterAmount = counterAmount;

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};