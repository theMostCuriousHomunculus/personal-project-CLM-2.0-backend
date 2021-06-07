import jwt from 'jsonwebtoken';

import Account from '../models/account-model.js';
import pubsub from './pubsub.js';
import { Event } from '../models/event-model.js';
import { Match } from '../models/match-model.js';

export default async function (context) {
  const decodedToken = jwt.verify(context.connectionParams.authToken, process.env.JWT_SECRET);
  const account = await Account.findById(decodedToken._id);

  if (account) context.account = account;

  if (context.connectionParams.eventID) {
    const event = await Event.findOne({ '_id': context.connectionParams.eventID, players: { $elemMatch: { account: account._id } } });

    if (!event) throw new Error("You were not invited to this event.");

    context.event = event;
  }
  
  if (context.connectionParams.matchID) {
    const match = await Match.findById(context.connectionParams.matchID);

    if (!match) throw new Error("Could not find a match with the provided matchID.");

    context.match = match;
  }

  context.pubsub = pubsub;
}