import jwt from 'jsonwebtoken';

import Account from '../models/account-model.js';
import pubsub from './pubsub.js';
import { Event } from '../models/event-model.js';

export default async function (context) {
  const decodedToken = jwt.verify(context.connectionParams.authToken, process.env.JWT_SECRET);
  const account = await Account.findById(decodedToken._id);

  if (!account) throw new Error("You must be logged into to join events.");

  const event = await Event.findOne({ '_id': context.connectionParams.eventID, players: { $elemMatch: { account: account._id } } });

  if (!event) throw new Error("You were not invited to this event.");

  context.account = account;
  context.event = event;
  context.pubsub = pubsub;
}