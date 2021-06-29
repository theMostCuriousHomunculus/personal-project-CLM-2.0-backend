import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, zone } } = args;

  let card;
  
  if (zone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
  } else {
    card = player[zone].find(crd => crd._id.toString() === cardID);
  }

  if (zone.toString() !== 'hand' && zone.toString() !== 'library') {
    // card was turned face up or face down in view of other players
    card.visibility = match.players.map(plr => plr.account);
  }

  if (card.face_down && card.visibility.length === match.players.length) {
    match.log.push(`${account.name} turned ${card.name} face-up.`);
  } else if (!card.face_down && card.visibility.length === match.players.length) {
    match.log.push(`${account.name} turned ${card.name} face-down.`);
  } else {
    // the card was turned face up or face down in a player's hand or on their library; nothing needs to be logged
  }

  card.face_down = !card.face_down;

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};