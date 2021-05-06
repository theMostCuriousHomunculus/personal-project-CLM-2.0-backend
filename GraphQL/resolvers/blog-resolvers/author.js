import Account from '../../../models/account-model.js';

export default async function (parent, args, context) {
  const { author } = parent;
  const account = await Account.findById(author);

  return account;
};