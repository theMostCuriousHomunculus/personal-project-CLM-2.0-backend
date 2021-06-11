import jwt from 'jsonwebtoken';

import Account from './models/account-model.js';
import Cube from './models/cube-model.js';
import pubsub from './GraphQL/pubsub.js';
import { Event } from './models/event-model.js';
import { Match } from './models/match-model.js';

export default async function (req, res, next) {
  try {

    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const account = await Account.findById(decodedToken._id);
  
      req.account = account;
      req.token = token;
    }

    if (req.header('CubeID')) {
      const cube = await Cube.findById(req.header('CubeID'));
      req.cube = cube;
    }

    if (req.header('EventID')) {
      const event = await Event.findOne({ '_id': req.header('EventID'), players: { $elemMatch: { account: req.account._id } } });
      req.event = event;
      req.player = event ? event.players.find(plr => plr.account.toString() === req.account._id.toString()) : null;
    }

    if (req.header('MatchID')) {
      const match = await Match.findById(req.header('MatchID'));
      req.match = match;
      req.player = match ? match.players.find(plr => plr.account.toString() === req.account._id.toString()) : null;
    }

    req.pubsub = pubsub;

  } catch (error) {
    req.account = null;
    req.cube = null;
    req.event = null;
    req.match = null;
    req.player = null;
    req.pubsub = null;
  } finally {
    next();
  }
};