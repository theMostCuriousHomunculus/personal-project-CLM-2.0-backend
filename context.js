import jwt from 'jsonwebtoken';

import pubsub from './GraphQL/pubsub.js';
import Account from './models/account-model.js';
import Blog from './models/blog-model.js';
import Cube from './models/cube-model.js';
import Deck from './models/deck-model.js';
import Match from './models/match-model.js';
import { Event } from './models/event-model.js';

export default async function (req, res, next) {
  try {

    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const account = await Account.findById(decodedToken._id);
  
      req.account = account;
      req.token = token;
    }

    if (req.header('BlogPostID')) {
      const blogPost = await Blog.findById(req.header('BlogPostID'));
      req.blogPost = blogPost;
    }

    if (req.header('CubeID')) {
      const cube = await Cube.findById(req.header('CubeID'));
      req.cube = cube;
    }

    if (req.header('DeckID')) {
      const deck = await Deck.findById(req.header('DeckID'));
      req.deck = deck;
    }

    if (req.header('EventID')) {
      const event = await Event.findOne({ '_id': req.header('EventID'), players: { $elemMatch: { account: req.account._id } } });
      req.event = event;
      req.player = event ? event.players.find(plr => plr.account.toString() === req.account._id.toString()) : null;
    }

    if (req.header('MatchID')) {
      const match = await Match.findById(req.header('MatchID'));
      
      for (const plr of match.players) {
        plr.library.sort((a,b) => a.index - b.index);
      }

      req.match = match;
      req.player = match && req.account ? match.players.find(plr => plr.account.toString() === req.account._id.toString()) : null;
    }

    req.pubsub = pubsub;

  } catch (error) {
    req.account = null;
    req.cube = null;
    req.deck = null;
    req.event = null;
    req.match = null;
    req.player = null;
    req.pubsub = null;
    req.token = null;
  } finally {
    next();
  }
};