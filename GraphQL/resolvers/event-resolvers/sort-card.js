import arrayMove from 'array-move';

import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { event, player, pubsub } = context;
  const { input: { newIndex, oldIndex } } = args;

  if (!event) throw new HttpError("An event with the provided ID does not exist or you were not invited to it.", 404);

  let collection;

  if (args.input.collection.toString() === "current_pack") {
    collection = player.queue[0];
  } else {
    collection = player[args.input.collection.toString()];
  }

  if (oldIndex >= collection.length ||
    newIndex >= collection.length ||
    oldIndex < 0 ||
    newIndex < 0) {
    throw new HttpError(`Invalid index.  Indexes must be integers between 0 and ${collection.length - 1}`, 409);
  }

  arrayMove.mutate(collection, oldIndex, newIndex);

  await event.save();
  pubsub.publish(event._id.toString(), { joinEvent: event });

  return event;
};