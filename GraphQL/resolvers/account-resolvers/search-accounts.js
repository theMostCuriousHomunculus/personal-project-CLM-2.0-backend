import Account from '../../../models/account-model.js';

export default async function (args, req) {
  const { name } = args;
  const matchingUsers = await Account.find(
    { $text: { $search: name } },
    { score: { $meta: 'textScore' } }
  )
    .select('avatar name')
    .sort({ score: { $meta: 'textScore' } });

  return matchingUsers;
};