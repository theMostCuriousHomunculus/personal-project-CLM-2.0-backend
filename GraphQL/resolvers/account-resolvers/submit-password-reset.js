import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context) {
  const { input: { email, password, reset_token } } = args;
  const user = await Account.findOne({
    email,
    reset_token,
    reset_token_expiration: { $gt: Date.now() }
  });

  if (!user) throw new HttpError(`Invalid reset token.`, 401);

  user.password = password;
  user.reset_token = null;
  user.reset_token_expiration = null;

  const token = await user.generateAuthenticationToken();

  return {
    isAdmin: user.admin,
    token,
    userId: user._id
  };
}