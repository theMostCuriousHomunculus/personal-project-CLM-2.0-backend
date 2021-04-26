import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (req, res) {
  try {
    const user = await Account.findOne({
      email: req.body.email,
      reset_token: req.params.resetToken,
      reset_token_expiration: { $gt: Date.now() }
    });

    if (!user) throw new HttpError(`Invalid reset token.`, 401);

    user.password = req.body.password;
    user.reset_token = null;
    user.reset_token_expiration = null;

    const token = await user.generateAuthenticationToken();

    res.status(200).header('Authorization', `Bearer ${token}`).json({
      isAdmin: user.admin,
      token,
      userId: user._id
    });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
}