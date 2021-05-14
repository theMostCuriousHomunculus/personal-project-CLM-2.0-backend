import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const budObjects = await Account.find({ '_id': { $in: parent.buds } });

  return budObjects;
};