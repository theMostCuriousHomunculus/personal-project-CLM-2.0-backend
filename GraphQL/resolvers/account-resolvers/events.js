import { Event } from '../../../models/event-model.js';

export default async function (parent, args, context) {
  const { _id } = parent;
  const events = await Event.find({ "players.account": _id });

  return events;
};