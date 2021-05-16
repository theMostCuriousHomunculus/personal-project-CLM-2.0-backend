import HttpError from '../../../models/http-error.js';
import transporter from '../../../utils/sendgrid-transporter.js';

import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const { input: { avatar, email, name, password } } = args;

  const existingUsersWithEmail = await Account.find({ email });

  if (existingUsersWithEmail.length > 0) throw new HttpError("An account with that email address already exists.  Use a different email address to register or try logging in instead.", 409);

  const existingUsersWithName = await Account.find({ name });

  if (existingUsersWithName.length > 0) throw new HttpError("An account with that name already exists.  Please choose a different name so that other users can uniquely identify you.", 409);

  const account = new Account({ avatar, email, name, password });
  
  const token = await account.generateAuthenticationToken();
  
  transporter.sendMail({
    to: email,
    from: `CubeLevelMidnight@gmail.com`,
    subject: `Welcome to Cube Level Midnight`,
    html: `<h1>Hells Yeah!</h1>
    <p>Cube Level Midnight is the dopest.</p>`
  });

  await account.save();
  
  return {
    token,
    userId: account._id
  };
};