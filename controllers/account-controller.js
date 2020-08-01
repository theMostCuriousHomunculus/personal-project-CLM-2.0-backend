const jwt = require('jsonwebtoken');

const { asyncArray } = require('../utils/async-array');
const { Account } = require('../models/account-model');

async function deleteAccount (req, res) {
    // still need to write this code; it needs to remove the deleted user's id from the buds, received_bud_requests, and sent_bud_requests arrays of all other users
};

async function editAccount (req, res) {
  // this route is protected (i.e. has gone through middleware) so the user account has already been attached to req
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

    const otherUser = await Account.findById(req.body.other_user_id);

    if (otherUser && !otherUser._id.equals(req.user._id)) {
      // the user is either removing a bud from their bud list, or accepting, rejecting or sending a bud request
      if (
        // don't allow users to accept a bud request that they haven't received
        req.user.received_bud_requests.id(otherUser._id) &&
        otherUser.sent_bud_requests.id(req.user._id) &&
        req.body.action === 'accept'
      ) {
        req.user.received_bud_requests.pull(req.user.received_bud_requests.id(otherUser._id));
        otherUser.sent_bud_requests.pull(otherUser.sent_bud_requests.id(req.user._id));

        req.user.buds.push(otherUser._id);
        await req.user.save();
        otherUser.buds.push(req.user._id);
        await otherUser.save();
      } else if (req.body.action === 'reject') {
        req.user.received_bud_requests.pull(req.user.received_bud_requests.id(otherUser._id));
        otherUser.sent_bud_requests.pull(otherUser.sent_bud_requests.id(req.user._id));

        await req.user.save();
        await otherUser.save();
      } else if (req.body.action === 'remove') {
        req.user.buds.pull(req.user.buds.id(otherUser._id));
        await req.user.save();
        otherUser.buds.pull(otherUser.buds.id(req.user._id));
        await otherUser.save();
      } else if (
        // don't allow user A to send a bud request to user B if user A and user B are already buds, or if user B is currently awaiting a resposne to a bud request he sent to user A or if user A has already sent a bud request to user B and user B has not yet responded
        !req.user.buds.id(otherUser._id) &&
        !req.user.received_bud_requests.id(otherUser._id) &&
        !req.user.sent_bud_requests.id(otherUser._id) &&
        !otherUser.buds.id(req.user._id) &&
        !otherUser.received_bud_requests.id(req.user._id) &&
        !otherUser.sent_bud_requests.id(req.user._id) &&
        req.body.action === 'send'
      ) {
        req.user.sent_bud_requests.push(req.body.other_user_id);
        await req.user.save();
        otherUser.received_bud_requests.push(req.user._id);
        await otherUser.save();
      } else {
        // either the user sent an action request of 'accept' when they had not received a bud request from the other user, or the user tried to send a bud request to another user who is already a bud, or the user tried to send a bud request to another user who is currently awaiting a response to a bud request they sent, or they tried to send a bud request to a user who they have already sent a bud request to and who has not yet responded, or the request action was not 'accept', 'reject', 'remove' or 'send'
        return res.status(403).json({ message: 'Invalid action.' });
      }
    }
  }

  Account.updateOne(
    { _id: req.user._id },
    { $set: accountChanges },
    async function (error, result) {
      if (!error) {
        res.status(200).json(result);
      } else {
        res.status(500).json({ message: 'We are experiencing technical difficulties.  Please try again later.' });
      }
    }
  );
};

async function fetchAccount (req, res) {
    // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
    try {

        // const token = req.cookies['authentication_token'];
        const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : false;
        let user;

        if (!token) {
            // the requester is not logged in, so not sending email address
            user = await Account.findOne({ _id: req.params.accountId }).select('avatar buds cubes name');
        } else {
            // the requester has a token, so verifying that it is valid
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (decodedToken._id !== req.params.accountId) {
                // the requester is not the user for whom account information has been requested, so not sending email address
                user = await Account.findOne({ _id: req.params.accountId }).select('avatar buds cubes name received_bud_requests sent_bud_requests');
            } else {
                // the requester is requesting their own account information, so returning all their info except their status as an administrator, their password and their tokens (since there is no reason they would need to see these things)
                user = await Account.findOne({ _id: req.params.accountId }).select('avatar buds cubes email name received_bud_requests sent_bud_requests');
                await asyncArray(user.received_bud_requests, async function (aspiringBud, index, aspiringBuds) {
                    aspiringBuds[index] = await Account.findById(aspiringBud._id).select('avatar name');
                });
                await asyncArray(user.sent_bud_requests, async function (potentialBud, index, potentialBuds) {
                    potentialBuds[index] = await Account.findById(potentialBud._id).select('avatar name');
                });
            }
        }
        
        if (!user) {
            res.status(404).json({ message: 'Profile not found!' });
        } else {
            await asyncArray(user.buds, async function (bud, index, buds) {
                buds[index] = await Account.findById(bud._id).select('avatar name');
            });
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function fetchAccounts (req, res) {
    try {
        const matchingUsers = await Account.find(
            { $text: { $search: req.query.name } },
            { score: { $meta: 'textScore' } }
        )
        .select('avatar name')
        .sort({ score: { $meta: 'textScore' } });

        res.status(200).json(matchingUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function login (req, res) {
    // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
    try {
        const user = await Account.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthenticationToken();
        res.status(200)./*cookie('authentication_token', token).*/header('Authorization', `Bearer ${token}`).json({ message: 'Welcome Back!', userId: user._id, token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

async function logoutAll (req, res) {
    // this route is protected (i.e. has gone through middleware) so the user account has already been attached to req
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).json({ message: 'Successfully logged out on all devices!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function logoutThis (req, res) {
    // this route is protected (i.e. has gone through middleware) so the user account has already been attached to req
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.cookies['authentication_token'];
        });
        await req.user.save();
        res.status(200).json({ message: 'Successfully logged out on this device!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function register (req, res) {
    // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
    const { avatar, email, name, password } = req.body;
    const user = new Account({ avatar, email, name, password });
    try {
        await user.save();
        const token = await user.generateAuthenticationToken();
        res.status(201)./*cookie('authentication_token', token).*/header('Authorization', `Bearer ${token}`).json({ message: 'Welcome to Cube Level Midnight!', userId: user._id, token });
    } catch(error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    deleteAccount,
    editAccount,
    fetchAccount,
    fetchAccounts,
    login,
    logoutAll,
    logoutThis,
    register
};