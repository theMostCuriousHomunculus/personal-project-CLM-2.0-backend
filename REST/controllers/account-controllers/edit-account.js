import Account from '../../../models/account-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (req, res) {
  // this route is protected (i.e. has gone through middleware) so the user account has already been attached to req
  try {
    const mutableFields = ['avatar', 'email', 'name', 'password'];

    for (let field of mutableFields) {
      if (req.body[field]) {
        req.user[field] = req.body[field];
      }
    }

    if (req.body.other_user_id) {
      const otherUser = await Account.findById(req.body.other_user_id);

      if (!otherUser) {
        throw new HttpError('We are unable to process your request because the other user does not exist in our database.', 403);
      }

      if (otherUser._id === req.user._id) {
        throw new HttpError("You must provide a different user's ID.", 403);
      }
  
      switch (req.body.action) {
        case 'accept':
          if (
            req.user.received_bud_requests.includes(otherUser._id) &&
            otherUser.sent_bud_requests.includes(req.user._id)
          ) {
            req.user.received_bud_requests.pull(otherUser._id);
            otherUser.sent_bud_requests.pull(req.user._id);
            req.user.buds.push(otherUser._id);
            otherUser.buds.push(req.user._id);
            break;
          } else {
            throw new HttpError('You cannot accept a bud request that you did not receive or that the other user did not send.',403);
          }
        case 'reject':
          req.user.received_bud_requests.pull(otherUser._id);
          otherUser.sent_bud_requests.pull(req.user._id);
          break;
        case 'remove':
          req.user.buds.pull(otherUser._id);
          otherUser.buds.pull(req.user._id);
          break;
        case 'send':
          if (
            !req.user.buds.includes(otherUser._id) &&
            !req.user.received_bud_requests.includes(otherUser._id) &&
            !req.user.sent_bud_requests.includes(otherUser._id) &&
            !otherUser.buds.includes(req.user._id) &&
            !otherUser.received_bud_requests.includes(req.user._id) &&
            !otherUser.sent_bud_requests.includes(req.user._id)
          ) {
            req.user.sent_bud_requests.push(otherUser._id);
            otherUser.received_bud_requests.push(req.user._id);
            break;
          } else {
            throw new HttpError('You cannot send a bud request to another user if you are already buds or if there is already a pending bud request from one of you to the other.', 403);
          }
        default:
          throw new HttpError('Invalid action attempted.  Action must be "accept", "reject", "remove" or "send".', 403);
      }
      
      await otherUser.save();
    }

    await req.user.save();
    res.status(204).send();
  } catch (error) {

    if (error.code === 11000) {
      // 11000 appears to be the mongodb error code for a duplicate key
      error.message = `The username "${req.body.name}" is already in use.  Usernames must be unique.  Please try a different one.`
      error.code = 409;
    }

    res.status(error.code || 500).json({ message: error.message });
  }
};