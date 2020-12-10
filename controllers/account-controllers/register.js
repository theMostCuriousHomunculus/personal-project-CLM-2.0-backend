import { Account } from '../../models/account-model.js';

export default async function (req, res) {
  try {
    // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
    const { avatar, email, name, password } = req.body;
    const user = new Account({ avatar, email, name, password });
    await user.save();
    const token = await user.generateAuthenticationToken();
    res.status(201).header('Authorization', `Bearer ${token}`).json({ token, userId: user._id });
  } catch(error) {
    res.status(401).json({ message: error.message });
  }
};