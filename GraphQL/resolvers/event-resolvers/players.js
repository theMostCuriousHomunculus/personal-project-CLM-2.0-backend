// import { defaultFieldResolver } from 'graphql';

import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const proprietaryFields = ["chaff", "mainboard", "sideboard"];
  
  for (const plr of parent.players) {

    if (plr.account.toString() !== context.account._id.toString() &&
    plr.account.toString() !== parent.host._id.toString()) {

      for (const field of proprietaryFields) plr[field] = null;

    }

    if (plr.account.toString() === context.account._id.toString() &&
    plr.queue.length > 0) {
      plr.current_pack = plr.queue[0];
    } else {
      plr.current_pack = null;
    }

    plr.account = await Account.findById(plr.account);
  }

  return await Promise.all(parent.players);
};