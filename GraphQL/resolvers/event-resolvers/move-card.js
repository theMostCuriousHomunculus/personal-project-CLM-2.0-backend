import HttpError from '../../../models/http-error.js';
import { Event } from '../../../models/event-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("You must be logged in to rearrange cards.", 401);

  const { input: { cardID, destination, eventID, origin } } = args;
  const event = await Event.findById(eventID);

  if (!event) throw new HttpError("Could not find an event with the provided ID.", 404);

  const player = event.players.find(plr => plr.account.toString() === context.account._id.toString());

  if (!player) throw new HttpError("You were not invited to this event.", 401);

  const originCardsClone = [...player[origin.toString()]];
  const indexOfCard = originCardsClone.findIndex(card => card._id.toString() === cardID);

  if (indexOfCard === -1) throw new HttpError("Could not find a card with the provided ID in that collection.", 404);
  
  const cardToMove = originCardsClone.splice(indexOfCard, 1);
  const destinationCardsClone = [...player[destination.toString()]].concat(cardToMove);

  player[origin] = originCardsClone;
  player[destination] = destinationCardsClone;

  await event.save();
  context.pubsub.publish(eventID, { joinEvent: event });

  return event;
};