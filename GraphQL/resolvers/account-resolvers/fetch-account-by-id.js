import jwt from 'jsonwebtoken';

import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context) {
  const { _id } = args;
  const { req } = context;
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
  const decodedToken = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
  let account;

  if (!token || decodedToken._id !== _id) {
    // the requester is not requesting their own account information, so not sending email address, received_bud_requests, sent_bud_requests or cube mainboard, modules, rotations or sideboard
    account = await Account.findById(_id)
      .populate({ path: 'buds', select: 'avatar name' })
      .select('avatar buds name');
    
  } else {
    // the requester is requesting their own account information, so returning all their info except their status as an administrator, their password and their tokens (since there is no reason they would need to see these things)
    account = await Account.findById(_id)
      .populate({ path: 'buds', select: 'avatar name' })
      .populate({ path: 'received_bud_requests', select: 'avatar name' })
      .populate({ path: 'sent_bud_requests', select: 'avatar name' })
      .select('avatar buds email name received_bud_requests sent_bud_requests');

  }

  if (!account) throw new HttpError('Profile not found!', 404);

  return account;
};