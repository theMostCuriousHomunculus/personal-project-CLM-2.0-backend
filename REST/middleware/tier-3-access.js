// users without tier 3 access should only be allowed to view public content.  visitors to the site must sign up and/or login to obtain tier 3 access, which allows them to create cubes, host and join drafts, manage their account (including sending and responding to friend requests), and comment on articles

import jwt from 'jsonwebtoken';

import Account from '../../models/account-model.js';
import HttpError from '../../models/http-error.js';

export default async function (req, res, next) {

  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // const token = req.cookies['authentication_token'];
    let token = req.header('Authorization');

    if (!token) {
      throw new HttpError('You must be logged in to perform this action.', 401);
    } else {
      token = token.replace('Bearer ', '');
    }

    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new HttpError('You must be logged in to perform this action.', 401);
    }

    const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });

    if (!user) {
      throw new HttpError('You must be logged in to perform this action.', 401);
    } else {
      req.user = user;
      next();
    }

  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};