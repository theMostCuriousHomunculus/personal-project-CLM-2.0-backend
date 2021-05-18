import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const account = await Account.findById(parent.host);

  return account;
};