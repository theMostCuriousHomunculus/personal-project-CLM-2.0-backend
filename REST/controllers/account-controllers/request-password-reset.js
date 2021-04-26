import crypto from 'crypto';

import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';
import transporter from '../../../utils/sendgrid-transporter.js';

export default async function (req, res) {
  try {
    const buffer = crypto.randomBytes(32);
    const reset_token = buffer.toString(`hex`);

    const user = await Account.findOne({ email: req.body.email });

    if (!user) {
      throw new HttpError(`Could not find a user with the provided email address.`, 404);
    } else {
      user.reset_token = reset_token;
      user.reset_token_expiration = Date.now() + 900000;
      await user.save();
      transporter.sendMail({
        to: req.body.email,
        from: `CubeLevelMidnight@gmail.com`,
        subject: `Password Reset Link`,
        html: `
        <h1>We received a request to reset your password.</h1>
        <p>Click this <a href="${process.env.FRONT_END_URL}/reset/${reset_token}">link</a> to change your password.</p>
        <p>The link will expire after 15 minutes.</p>
        `
      });
      res.status(204).send();
    }

  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
}