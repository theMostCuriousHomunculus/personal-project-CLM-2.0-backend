import { Event } from '../../../models/event-model.js';

export default async function (parent, args, context, info) {
  const event = await Event.findById(parent.event);

  return event;
};