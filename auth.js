import jwt from 'jsonwebtoken';

import Account from './models/account-model.js';

export default async function (req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findById(decodedToken._id);

    req.account = account;
    req.token = token;
  } catch (error) {
    req.account = null;
  } finally {
    next();
  }
};