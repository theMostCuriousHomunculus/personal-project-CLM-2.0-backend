import { Account } from '../../models/account-model.js';

export default async function (req, res) {
  // this route is protected (i.e. has gone through middleware) so the user account has already been attached to req
  try {
    let accountChanges = {...req.user._doc};

    if (req.body.avatar) {
      accountChanges.avatar = req.body.avatar;
    }
    if (req.body.email) {
      accountChanges.email = req.body.email;
    }
    if (req.body.name) {
      accountChanges.name = req.body.name;
    }

    if (req.body.other_user_id) {
      // the user is either removing a bud from their bud list, or accepting, rejecting or sending a bud request
      const otherUser = await Account.findById(req.body.other_user_id);
  
      if (
        // don't allow users to accept a bud request that they haven't received
        req.user.received_bud_requests.includes(otherUser._id) &&
        otherUser.sent_bud_requests.includes(req.user._id) &&
        req.body.action === 'accept'
      ) {
        req.user.received_bud_requests.pull(otherUser._id);
        otherUser.sent_bud_requests.pull(req.user._id);

        req.user.buds.push(otherUser._id);
        await req.user.save();
        otherUser.buds.push(req.user._id);
        await otherUser.save();
      } else if (req.body.action === 'reject') {
        req.user.received_bud_requests.pull(otherUser._id);
        otherUser.sent_bud_requests.pull(req.user._id);

        await req.user.save();
        await otherUser.save();
      } else if (req.body.action === 'remove') {
        req.user.buds.pull(otherUser._id);
        await req.user.save();
        otherUser.buds.pull(req.user._id);
        await otherUser.save();
      } else if (
        // don't allow user A to send a bud request to user B if user A and user B are already buds, or if user B is currently awaiting a resposne to a bud request he sent to user A or if user A has already sent a bud request to user B and user B has not yet responded
        !req.user.buds.includes(otherUser._id) &&
        !req.user.received_bud_requests.includes(otherUser._id) &&
        !req.user.sent_bud_requests.includes(otherUser._id) &&
        !otherUser.buds.includes(req.user._id) &&
        !otherUser.received_bud_requests.includes(req.user._id) &&
        !otherUser.sent_bud_requests.includes(req.user._id) &&
        req.body.action === 'send'
      ) {
        req.user.sent_bud_requests.push(otherUser._id);
        await req.user.save();
        otherUser.received_bud_requests.push(req.user._id);
        await otherUser.save();
      } else {
        // either the user sent an action request of 'accept' when they had not received a bud request from the other user, or the user tried to send a bud request to another user who is already a bud, or the user tried to send a bud request to another user who is currently awaiting a response to a bud request they sent, or they tried to send a bud request to a user who they have already sent a bud request to and who has not yet responded, or the request action was not of type 'accept', 'reject', 'remove' or 'send'
        return res.status(403).json({ message: 'Invalid action.' });
      }
    }
  
    const updatedUser = await Account.findByIdAndUpdate(req.user._id,
      { $set: accountChanges },
      { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};