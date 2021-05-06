import Account from '../../../models/account-model.js';

export default async function (parent, args, context) {
  const { received_bud_requests: budIDs } = parent;
  const budObjects = await Account.find({ '_id': { $in: budIDs } });

  return budObjects;
};