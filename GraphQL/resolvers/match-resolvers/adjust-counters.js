import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { cardID, counterAmount, counterType, matchID, playerID, zone } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const playerIndex = match.players.findIndex(plr => plr.account.toString() === playerID);
  const player = match.players[playerIndex];
  const cardIndex = player[zone].findIndex(crd => crd._id.toString() === cardID);
  const card = player[zone][cardIndex];

  if (counterAmount > card.counters[counterType]) {
    match.log.push(`${context.account.name} added ${card.counters[counterType] - counterAmount} ${counterType} counters to ${card.name}; from ${card.counters[counterType]} to ${counterAmount}.`);
  } else if (counterAmount < card.counters[counterType]) {
    match.log.push(`${context.account.name} removed ${card.counters[counterType] - counterAmount} ${counterType} counters from ${card.name}; from ${card.counters[counterType]} to ${counterAmount}.`);
  }

  card.counters[counterType] = counterAmount;
  match.markModified(`players[${playerIndex}].${zone}[${cardIndex}].counters`);

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};