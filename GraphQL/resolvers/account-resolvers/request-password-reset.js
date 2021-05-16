import crypto from 'crypto';

import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';
import transporter from '../../../utils/sendgrid-transporter.js';

export default async function (parent, args, context, info) {
  const { email } = args;
  const buffer = crypto.randomBytes(32);
  const reset_token = buffer.toString(`hex`);
  const account = await Account.findOne({ email });

  if (!account) {
    throw new HttpError("Could not find a user with the provided email address.", 404);
  } else {
    account.reset_token = reset_token;
    account.reset_token_expiration = Date.now() + 900000;
    await account.save();
    transporter.sendMail({
      to: email,
      from: `CubeLevelMidnight@gmail.com`,
      subject: `Password Reset Link`,
      html: `
      <h1>We received a request to reset your password.</h1>
      <p>Click this <a href="${process.env.FRONT_END_URL}/reset/${reset_token}">link</a> to change your password.</p>
      <p>The link will expire after 15 minutes.</p>
      `
    });
    
    return true;
  }
};