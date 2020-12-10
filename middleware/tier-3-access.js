// users without tier 3 access should only be allowed to view public content.  visitors to the site must sign up and/or login to obtain tier 3 access, which allows them to create cubes, host and join drafts, manage their account (including sending and responding to friend requests), and comment on articles

import jwt from 'jsonwebtoken';

import { Account } from '../models/account-model.js';

export default async function (req, res, next) {

  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // const token = req.cookies['authentication_token'];
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      throw new Error('You must be logged in to perform this action.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });
    if (!user) {
      throw new Error('You are do not have permission to perform the requested action.');
    } else {
      req.user = user;
    }

    next();

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};