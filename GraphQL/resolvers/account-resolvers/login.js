import Account from '../../../models/account-model.js';

export default async function (parent, args, context) {
  const { input: { email, password } } = args;
  const user = await Account.findByCredentials(email, password);
  const token = await user.generateAuthenticationToken();

  return {
    isAdmin: user.admin,
    token,
    userId: user._id
  };
};