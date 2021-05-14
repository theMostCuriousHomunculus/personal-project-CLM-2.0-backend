import jwt from 'jsonwebtoken';

import Account from './models/account-model.js';

export default async function (req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findById(decodedToken._id);

    req.requesterID = account._id;
    req.isAdmin = account.admin;
  } catch (error) {
    // if there isn't a token or if the token is bad, not setting the requesterID
    req.isAdmin = false;
  } finally {
    next();
  }
};