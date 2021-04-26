import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';
import transporter from '../../../utils/sendgrid-transporter.js';

export default async function (req, res) {
  try {
    // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
    const { avatar, email, name, password } = req.body;

    const existingUsersWithEmail = await Account.find({ email });

    if (existingUsersWithEmail.length > 0) throw new HttpError('An account with that email address already exists.  Use a different email address to register or try logging in instead.', 409);

    const existingUsersWithName = await Account.find({ name });

    if (existingUsersWithName.length > 0) throw new HttpError('An account with that name already exists.  Please choose a different name so that other users can uniquely identify you.', 409);

    const user = new Account({ avatar, email, name, password });

    await user.save();
    
    const token = await user.generateAuthenticationToken();
    
    transporter.sendMail({
      to: email,
      from: `CubeLevelMidnight@gmail.com`,
      subject: `Welcome to Cube Level Midnight`,
      html: `<h1>Hells Yeah!</h1>
      <p>Cube Level Midnight is the dopest.</p>`
    });
    
    res.status(201).header('Authorization', `Bearer ${token}`).json({ token, userId: user._id });
  } catch(error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};