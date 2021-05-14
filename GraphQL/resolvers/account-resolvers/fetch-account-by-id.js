import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { _id } = args;
  const account = await Account.findById(_id)

  if (!account) throw new HttpError('Profile not found!', 404);

  return account;
};