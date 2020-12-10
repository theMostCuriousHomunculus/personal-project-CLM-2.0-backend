// tier 1 access is for site admins only.  tier 1 access allows posting articles

import jwt from 'jsonwebtoken';

import { Account } from '../models/account-model.js';

export default async function (req, res, next) {
  if (req.method === 'OPTIONS') {
      return next();
  }

  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        throw new Error('You must be logged in to perform this action.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });

    if (user && user.admin) {
      req.user = user;
    } else {
      throw new Error('You are do not have permission to perform the requested action.');
    }

    next();
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};