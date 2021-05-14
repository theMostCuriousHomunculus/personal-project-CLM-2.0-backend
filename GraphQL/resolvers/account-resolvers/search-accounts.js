import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const { name } = args;
  const matchingUsers = await Account.find(
    { $text: { $search: name } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } });

  return matchingUsers;
};