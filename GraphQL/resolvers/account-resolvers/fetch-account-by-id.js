import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const account = await Account.findById(args._id)

  if (!account) throw new HttpError('Profile not found!', 404);

  return account;
};