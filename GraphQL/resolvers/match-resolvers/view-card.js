import HttpError from '../../../models/http-error.js';
import Account from '../../../models/account-model.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, controllerID, zone } } = args;
  const controller = match.players.find(plr => plr.account.toString() === controllerID);

  if (!controller) throw new HttpError("Invalid controllerID.", 404);
  
  const controllerAccount = await Account.findById(controllerID);
  let card;
  
  if (zone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
  } else {
    card = controller[zone].find(crd => crd._id.toString() === cardID);
  }

  if (!card.visibility.includes(account._id)) card.visibility.push(account._id);

  match.log.push(`${match.players.every(plr => card.visibility.includes(plr.account)) ? card.name : 'A card'} ${zone.toString() === 'stack' ? 'on the stack' : 'in ' + controllerAccount.name + "'s " + zone} is now visible to ${account.name}.`);

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};