import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {

  const { host, players } = parent;
  const { account } = context;
  const proprietaryFields = ["chaff", "mainboard", "sideboard"];
  
  for (const plr of players) {

    if (!account || (plr.account.toString() !== account._id.toString() && account._id.toString() !== host.toString())) {

      for (const field of proprietaryFields) plr[field] = null;

    }

    if (account && plr.account.toString() === account._id.toString() && plr.queue.length > 0) {
      plr.current_pack = plr.queue[0];
    } else {
      plr.current_pack = null;
    }

    plr.account = await Account.findById(plr.account);
  }

  return await Promise.all(players);
};