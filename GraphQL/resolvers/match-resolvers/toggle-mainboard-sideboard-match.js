import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { cardID } = args;

  let card;
  
  if (player.mainboard.id(cardID)) {
    card = player.mainboard.id(cardID);
    player.mainboard.pull(cardID);
    card.sideboarded = true;
    player.sideboard.push(card);
  } else if (player.sideboard.id(cardID)) {
    card = player.sideboard.id(cardID);
    player.sideboard.pull(cardID);
    card.sideboarded = false;
    player.mainboard.push(card);
  } else {
    throw new HttpError("A card with the provided ID does not exist in this deck.", 404);
  }

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};