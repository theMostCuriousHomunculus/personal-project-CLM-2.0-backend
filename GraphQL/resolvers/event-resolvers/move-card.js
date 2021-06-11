import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { event, player, pubsub } = context;

  if (!event) throw new HttpError("An event with the provided ID does not exist or you were not invited to it.", 404);

  const { input: { cardID, destination, origin } } = args;

  const originCardsClone = [...player[origin.toString()]];
  const indexOfCard = originCardsClone.findIndex(card => card._id.toString() === cardID);

  if (indexOfCard === -1) throw new HttpError("Could not find a card with the provided ID in that collection.", 404);
  
  const cardToMove = originCardsClone.splice(indexOfCard, 1);
  const destinationCardsClone = [...player[destination.toString()]].concat(cardToMove);

  player[origin] = originCardsClone;
  player[destination] = destinationCardsClone;

  await event.save();
  pubsub.publish(event._id.toString(), { joinEvent: event });

  return event;
};