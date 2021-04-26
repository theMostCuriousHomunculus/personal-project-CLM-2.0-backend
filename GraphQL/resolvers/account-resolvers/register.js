import HttpError from '../../../models/http-error.js';
import transporter from '../../../utils/sendgrid-transporter.js';

import Account from '../../../models/account-model.js';

export default async function (args, req) {
  const { input: { avatar, email, name, password } } = args;

  const existingUsersWithEmail = await Account.find({ email });

  if (existingUsersWithEmail.length > 0) throw new HttpError('An account with that email address already exists.  Use a different email address to register or try logging in instead.', 409);

  const existingUsersWithName = await Account.find({ name });

  if (existingUsersWithName.length > 0) throw new HttpError('An account with that name already exists.  Please choose a different name so that other users can uniquely identify you.', 409);

  const user = new Account({ avatar, email, name, password });
  
  const token = await user.generateAuthenticationToken();
  
  transporter.sendMail({
    to: email,
    from: `CubeLevelMidnight@gmail.com`,
    subject: `Welcome to Cube Level Midnight`,
    html: `<h1>Hells Yeah!</h1>
    <p>Cube Level Midnight is the dopest.</p>`
  });

  await user.save();
  
  return {
    token,
    userId: user._id.toString()
  };
};