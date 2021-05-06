import Account from '../../../models/account-model.js';

export default async function (parent, args, context) {
  const { host } = parent;
  const account = await Account.findById(host);

  return account;
};