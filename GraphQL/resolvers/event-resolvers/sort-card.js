import arrayMove from 'array-move';

import { Event } from '../../../models/event-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("You must be logged in to rearrange cards.", 401);

  const { input: { collection, eventID, newIndex, oldIndex } } = args;

  const event = await Event.findById(eventID);

  if (!event) throw new HttpError("Could not find an event with the provided ID.", 404);

  const player = event.players.find(plr => plr.account.toString() === context.account._id.toString());

  if (!player) throw new HttpError("You were not invited to this event.", 401);

  if (oldIndex >= player[collection].length ||
    newIndex >= player[collection].length ||
    oldIndex < 0 ||
    newIndex < 0) {
    throw new HttpError(`Invalid index.  Indexes must be integers between 0 and ${player[collection].length - 1}`, 409);
  }

  player[collection] = arrayMove(player[collection], oldIndex, newIndex);

  await event.save();
  context.pubsub.publish(eventID, { event });
};