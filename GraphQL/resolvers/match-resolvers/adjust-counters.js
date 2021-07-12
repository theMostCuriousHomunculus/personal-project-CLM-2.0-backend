import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, counterAmount, counterType, zone } } = args;

  let card;
  
  if (zone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
  } else {
    card = player[zone].find(crd => crd._id.toString() === cardID);
  }

  const counterObject = card.counters.find(obj => obj.counterType === counterType);

  if (!counterObject) {
    match.log.push(`${account.name} added ${counterAmount} ${counterType} counters to ${card.name}.`);
    card.counters.push({ counterAmount, counterType });
  } else if (counterAmount > counterObject.counterAmount) {
    match.log.push(`${account.name} added ${counterAmount - counterObject.counterAmount} ${counterType} counters to ${card.name}; from ${counterObject.counterAmount} to ${counterAmount}.`);
    counterObject.counterAmount = counterAmount;
  } else if (counterAmount < counterObject.counterAmount) {
    match.log.push(`${account.name} removed ${counterObject.counterAmount - counterAmount} ${counterType} counters from ${card.name}; from ${counterObject.counterAmount} to ${counterAmount}.`);
    counterObject.counterAmount = counterAmount;
  } else {
    throw new HttpError(`Amount of ${counterType} counters did not change.`, 400);
  }

  card.counters = card.counters.filter(obj => obj.counterAmount > 0);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};