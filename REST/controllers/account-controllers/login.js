import Account from '../../../models/account-model.js';

export default async function (req, res) {
  // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
  try {
    const user = await Account.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthenticationToken();
    res.status(200)./*cookie('authentication_token', token).*/header('Authorization', `Bearer ${token}`).json({
      isAdmin: user.admin,
      token,
      userId: user._id
    });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};