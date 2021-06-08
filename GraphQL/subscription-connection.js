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

    if (!event) throw new Error("An event with that ID does not exist or you were not invited to it.");

    context.event = event;
  }
  
  if (context.connectionParams.matchID) {
    const match = await Match.findById(context.connectionParams.matchID);

    if (!match) throw new Error("Could not find a match with the provided matchID.");

    context.player = account ? match.players.find(plr => plr.account === account._id) : null;
    context.match = match;
  }

  context.pubsub = pubsub;
}