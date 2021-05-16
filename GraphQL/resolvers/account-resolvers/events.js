import { Event } from '../../../models/event-model.js';

export default async function (parent, args, context, info) {
  const events = await Event.find({ "players.account": parent._id });

  return events;
};