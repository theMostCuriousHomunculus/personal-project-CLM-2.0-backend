import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {

  const { host, players } = parent;
  const { account } = context;
  const proprietaryFields = ["chaff", "mainboard", "sideboard"];
  
  for (const plr of players) {

    if (plr.account.toString() !== account._id.toString() && plr.account.toString() !== host._id.toString()) {

      for (const field of proprietaryFields) plr[field] = null;

    }

    if (plr.account.toString() === account._id.toString() && plr.queue.length > 0) {
      plr.current_pack = plr.queue[0];
    } else {
      plr.current_pack = null;
    }

    plr.account = await Account.findById(plr.account);
  }

  return await Promise.all(players);
};