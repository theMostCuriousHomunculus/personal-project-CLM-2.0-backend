import Account from '../../../models/account-model.js';

export default async function (parent, args, context) {
  const { creator } = parent;
  const account = await Account.findById(creator);

  return account;
};