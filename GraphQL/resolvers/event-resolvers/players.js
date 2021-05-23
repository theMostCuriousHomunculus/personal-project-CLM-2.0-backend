// import { defaultFieldResolver } from 'graphql';

import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {
  const proprietaryFields = ["chaff", "mainboard", "packs", "queue", "sideboard"];
  
  for (const plr of parent.players) {

    if (plr.account.toString() !== context.account._id.toString() &&
    plr.account.toString() !== parent.host._id.toString()) {

      for (const field of proprietaryFields) plr[field] = null;

    }

    plr.account = await Account.findById(plr.account);
  }

  return await Promise.all(parent.players);
};