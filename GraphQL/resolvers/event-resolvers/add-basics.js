import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { event, player, pubsub } = context;

  if (!event) throw new HttpError("An event with the provided ID does not exist or you were not invited to it.", 404);

  const { input: { card, component, numberOfCopies } } = args;

  for (let i = 0; i < numberOfCopies; i++) {
    player[component.toString()].push(card);
  }

  await event.save();
  pubsub.publish(event._id.toString(), { subscribeEvent: event });

  return event;
};