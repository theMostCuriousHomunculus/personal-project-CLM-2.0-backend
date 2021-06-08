import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, controllerID, numberOfCopies, zone } } = args;
  const controller = match.players.find(plr => plr.account.toString() === controllerID);

  if (!controller) throw new HttpError("Invalid controllerID.", 404);

  let card;

  if (zone === 'stack') {
    for (const i = 0; i < numberOfCopies; i++) {
      match.stack.push({
        ...card,
        controller: copyOwner.account,
        counters: {},
        isToken: true,
        owner: copyOwner.account
      });
    }
  } else if (zone === 'battlefield') {
    card  = controller[zone].find(crd => crd._id.toString() === cardID);
    for (const i = 0; i < numberOfCopies; i++) {
      copyOwner.battlefield.push({
        ...card,
        controller: copyOwner.account,
        counters: {},
        isToken: true,
        owner: copyOwner.account,
        x_coordinate: i,
        y_coordinate: i
      });
    }
  } else {
    throw new HttpError("Copies can only exist on the stack or on the battlefield.", 400);
  }

  await match.save();
  context.pubsub.publish(context.match._id.toString(), { joinMatch: match });

  return match;
};