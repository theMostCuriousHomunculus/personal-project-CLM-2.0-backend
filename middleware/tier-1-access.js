// tier 1 access is for site admins only.  tier 1 access allows posting articles

import jwt from 'jsonwebtoken';

import Account from '../models/account-model.js';
import HttpError from '../models/http-error.js';

export default async function (req, res, next) {

  if (req.method === 'OPTIONS') {
      return next();
  }

  try {
    let token = req.header('Authorization');

    if (!token) {
      throw new HttpError('You must be logged in as an administrator to perform this action.', 401);
    } else {
      token = token.replace('Bearer ', '')
    }

    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new HttpError('You must be logged in as an administrator to perform this action.', 401);
    }

    const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });

    if (user && user.admin) {
      req.user = user;
    } else {
      throw new HttpError('You must be logged in as an administrator to perform this action.', 401);
    }

    next();

  } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
  }
};