import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {

  if (context.requesterID.toString() !== parent._id.toString()) {
    return null;
  } else {
    const budObjects = await Account.find({ '_id': { $in: parent.received_bud_requests } });

    return budObjects;
  }

};