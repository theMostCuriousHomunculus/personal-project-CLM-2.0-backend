import HttpError from '../../../models/http-error.js';
import { Event } from '../../../models/event-model.js';

export default {
  subscribe: async function (parent, args, context, info) {

    if (!context.account) throw new HttpError("You must be logged in to join events.", 401);

    const event = await Event.findById(args.eventID);

    if (!event) throw new HttpError("Could not find an event with that ID.", 404);

    const invited = event.players.some(plr => plr.account.toString() === context.account._id.toString());

    if (!invited) throw new HttpError("You were not invited to this event.", 401);

    return context.pubsub.asyncIterator(args.eventID);
  }
};