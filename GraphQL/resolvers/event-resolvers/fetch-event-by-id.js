import HttpError from '../../../models/http-error.js';
import { Event } from '../../../models/event-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("You must be logged in to view events.", 401);

  const event = await Event.findById(args._id);

  if (!event) throw new HttpError("Could not find an event with the provided ID.", 404);

  if (!event.players.some(plr => plr.account.toString() === context.account._id.toString())) throw new HttpError("You were not invited to this event.", 401);
    
  return event;
};