import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { event, player, pubsub } = context;

  if (!event) throw new HttpError("An event with the provided ID does not exist or you were not invited to it.", 404);

  const { cardID } = args;

  let card;
  
  if (player.mainboard.id(cardID)) {
    card = player.mainboard.id(cardID);
    player.mainboard.pull(cardID);
    player.sideboard.push(card);
  } else if (player.sideboard.id(cardID)) {
    card = player.sideboard.id(cardID);
    player.sideboard.pull(cardID);
    player.mainboard.push(card);
  } else {
    throw new HttpError("A card with the provided ID does not exist in this deck.", 404);
  }

  await event.save();
  pubsub.publish(event._id.toString(), { subscribeEvent: event });

  return event;
};