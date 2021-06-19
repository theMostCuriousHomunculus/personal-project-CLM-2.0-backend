import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account } = context;

  if (!account) throw new HttpError("You must be logged in to perform this action.", 401);

  const { input: { action, avatar, email, name, other_user_id, password } } = args;

  try {
    const mutableFields = ['avatar', 'email', 'name', 'password'];

    for (let field of mutableFields) {
      if (args.input[field] && args.input[field] !== 'null' && args.input[field] !== 'undefined') {
        account[field] = args.input[field];
      }
    }

    if (other_user_id && other_user_id !== 'null' && other_user_id !== 'undefined') {
      const otherUser = await Account.findById(other_user_id);

      if (!otherUser) {
        throw new HttpError("We are unable to process your request because the other user does not exist in our database.", 403);
      }

      if (otherUser._id === account._id) {
        throw new HttpError("You must provide a different user's ID.", 403);
      }
  
      switch (action) {
        case 'accept':
          if (
            account.received_bud_requests.includes(otherUser._id) &&
            otherUser.sent_bud_requests.includes(account._id)
          ) {
            account.received_bud_requests.pull(otherUser._id);
            otherUser.sent_bud_requests.pull(account._id);
            account.buds.push(otherUser._id);
            otherUser.buds.push(account._id);
            break;
          } else {
            throw new HttpError("You cannot accept a bud request that you did not receive or that the other user did not send.", 403);
          }
        case 'reject':
          account.received_bud_requests.pull(otherUser._id);
          otherUser.sent_bud_requests.pull(account._id);
          break;
        case 'remove':
          account.buds.pull(otherUser._id);
          otherUser.buds.pull(account._id);
          break;
        case 'send':
          if (
            !account.buds.includes(otherUser._id) &&
            !account.received_bud_requests.includes(otherUser._id) &&
            !account.sent_bud_requests.includes(otherUser._id) &&
            !otherUser.buds.includes(account._id) &&
            !otherUser.received_bud_requests.includes(account._id) &&
            !otherUser.sent_bud_requests.includes(account._id)
          ) {
            account.sent_bud_requests.push(otherUser._id);
            otherUser.received_bud_requests.push(account._id);
            break;
          } else {
            throw new HttpError("You cannot send a bud request to another user if you are already buds or if there is already a pending bud request from one of you to the other.", 403);
          }
        default:
          throw new HttpError('Invalid action attempted.  Action must be "accept", "reject", "remove" or "send".', 403);
      }
      
      await otherUser.save();
    }

    await account.save();
    
    return account;
  } catch (error) {

    if (error.code === 11000) {
      // 11000 appears to be the mongodb error code for a duplicate key
      error.message = `The provided email address and/or username are/is already in use.  Email addresses and usernames must be unique.`
      error.code = 409;
    }

    throw error;
  }
};