import jwt from 'jsonwebtoken';

import { Account } from '../../models/account-model.js';
import { Cube } from '../../models/cube-model.js';
import { Event } from '../../models/event-model.js';

export default async function (req, res) {
  // this route is not protected (i.e. has not gone through any middleware) so the user account has not been attached to req yet
  try {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    const decodedToken = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
    let user;

    if (!token || decodedToken._id !== req.params.accountId) {
      // the requester is not requesting their own account information, so not sending email address, sent or received requests
      user = await Account.findById(req.params.accountId)
        .populate({ path: 'buds', select: 'avatar name' })
        .select('avatar buds name received_bud_requests sent_bud_requests');
    } else {
      // the requester is requesting their own account information, so returning all their info except their status as an administrator, their password and their tokens (since there is no reason they would need to see these things)
      user = await Account.findById(req.params.accountId)
        .populate({ path: 'buds', select: 'avatar name' })
        .populate({ path: 'received_bud_requests', select: 'avatar name' })
        .populate({ path: 'sent_bud_requests', select: 'avatar name' })
        .select('avatar buds email name received_bud_requests sent_bud_requests');
    }
    
    if (!user) {
      res.status(404).json({ message: 'Profile not found!' });
    } else {
      const cubes = await Cube.find({ creator: req.params.accountId })
        .select('description modules._id modules.name name rotations._id rotations.name');
      const events = await Event.find({ "players.account": req.params.accountId })
        .populate({ path: 'host', select: 'avatar name' })
        .select('createdAt host name');
      res.status(200).json({ cubes, events, user });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};