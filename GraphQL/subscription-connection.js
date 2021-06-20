import jwt from 'jsonwebtoken';

import Account from '../models/account-model.js';
import Blog from '../models/blog-model.js';
import pubsub from './pubsub.js';
import { Event } from '../models/event-model.js';
import { Match } from '../models/match-model.js';

export default async function (context) {

  if (context.connectionParams.authToken) {
    const decodedToken = jwt.verify(context.connectionParams.authToken, process.env.JWT_SECRET);
    const account = await Account.findById(decodedToken._id);
  
    context.account = account;
  }

  if (context.connectionParams.blogPostID) {
    const blogPost = await Blog.findById(context.connectionParams.blogPostID);

    if (!blogPost) throw new Error("Could not find a blog post with the provided blogPostID.");

    context.blogPost = blogPost;
  }

  if (context.connectionParams.eventID) {
    const event = await Event.findOne({
      '_id': context.connectionParams.eventID,
      players: {
        $elemMatch: {
          account: context.account._id
        }
      }
    });

    if (!event) throw new Error("An event with that ID does not exist or you were not invited to it.");

    context.event = event;
  }
  
  if (context.connectionParams.matchID) {
    const match = await Match.findById(context.connectionParams.matchID);

    if (!match) throw new Error("Could not find a match with the provided matchID.");

    context.match = match;
  }

  context.pubsub = pubsub;
}