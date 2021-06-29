import HttpError from '../../../models/http-error.js';
import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { controllerID, zone } } = args;
  const controller = match.players.find(plr => plr.account.toString() === controllerID);

  if (!controller) throw new HttpError("Invalid controllerID.", 404);

  const controllerAccount = await Account.findById(controllerID);

  for (const card of controller[zone]) {
    if (!card.visibility.includes(account._id)) card.visibility.push(account._id);
  }

  match.log.push(`${account.name} viewed ${controllerAccount.name}'s ${zone}.`);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};