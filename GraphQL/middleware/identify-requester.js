import Account from '../../models/account-model.js';
import HttpError from '../../models/http-error.js';

export default async function (req) {
  let token = req.header('Authorization');

  if (!token) {
    throw new HttpError('You must be logged in to perform this action.', 401);
  } else {
    token = token.replace('Bearer ', '')
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new HttpError('You must be logged in to perform this action.', 401);
  }

  const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });

  if (!user) {
    throw new HttpError('You must be logged in to perform this action.', 401);
  } else {
    return user;
  }
}