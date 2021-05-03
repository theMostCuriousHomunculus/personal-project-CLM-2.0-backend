import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (parent, args, context) {

  const { input: { action, avatar, email, name, other_user_id, password } } = args;
  const { req } = context;
  const user = await identifyRequester(req);

  try {
    const mutableFields = ['avatar', 'email', 'name', 'password'];

    for (let field of mutableFields) {
      if (args.input[field]) {
        user[field] = args.input[field];
      }
    }

    if (other_user_id) {
      const otherUser = await Account.findById(other_user_id);

      if (!otherUser) {
        throw new HttpError('We are unable to process your request because the other user does not exist in our database.', 403);
      }

      if (otherUser._id === user._id) {
        throw new HttpError("You must provide a different user's ID.", 403);
      }
  
      switch (action) {
        case 'accept':
          if (
            user.received_bud_requests.includes(otherUser._id) &&
            otherUser.sent_bud_requests.includes(user._id)
          ) {
            user.received_bud_requests.pull(otherUser._id);
            otherUser.sent_bud_requests.pull(user._id);
            user.buds.push(otherUser._id);
            otherUser.buds.push(user._id);
            break;
          } else {
            throw new HttpError('You cannot accept a bud request that you did not receive or that the other user did not send.',403);
          }
        case 'reject':
          user.received_bud_requests.pull(otherUser._id);
          otherUser.sent_bud_requests.pull(user._id);
          break;
        case 'remove':
          user.buds.pull(otherUser._id);
          otherUser.buds.pull(user._id);
          break;
        case 'send':
          if (
            !user.buds.includes(otherUser._id) &&
            !user.received_bud_requests.includes(otherUser._id) &&
            !user.sent_bud_requests.includes(otherUser._id) &&
            !otherUser.buds.includes(user._id) &&
            !otherUser.received_bud_requests.includes(user._id) &&
            !otherUser.sent_bud_requests.includes(user._id)
          ) {
            user.sent_bud_requests.push(otherUser._id);
            otherUser.received_bud_requests.push(user._id);
            break;
          } else {
            throw new HttpError('You cannot send a bud request to another user if you are already buds or if there is already a pending bud request from one of you to the other.', 403);
          }
        default:
          throw new HttpError('Invalid action attempted.  Action must be "accept", "reject", "remove" or "send".', 403);
      }
      
      await otherUser.save();
    }

    await user.save();
    
    return true;

  } catch (error) {

    if (error.code === 11000) {
      // 11000 appears to be the mongodb error code for a duplicate key
      error.message = `The provided email address and/or username are/is already in use.  Email addresses and usernames must be unique.`
      error.code = 409;
    }

    throw error;
  }
};