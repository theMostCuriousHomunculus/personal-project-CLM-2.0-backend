import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const { account: accountID } = parent;
  const account = await Account.findById(accountID);

  return account;
};