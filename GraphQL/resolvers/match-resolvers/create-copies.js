import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, controllerID, numberOfCopies, zone } } = args;
  const controller = match.players.find(plr => plr.account.toString() === controllerID);

  if (!controller) throw new HttpError("Invalid controllerID.", 404);

  let card;

  if (zone === 'stack') {
    card  = match.stack.find(crd => crd._id.toString() === cardID);
    for (const i = 0; i < numberOfCopies; i++) {
      match.stack.push({
        ...card,
        controller: account._id,
        counters: [],
        isCopyToken: true,
        owner: account._id
      });
    }
  } else if (zone === 'battlefield') {
    card  = controller[zone].find(crd => crd._id.toString() === cardID);
    for (const i = 0; i < numberOfCopies; i++) {
      player.battlefield.push({
        ...card,
        controller: account._id,
        counters: [],
        isCopyToken: true,
        owner: account._id,
        x_coordinate: i,
        y_coordinate: i
      });
    }
  } else {
    throw new HttpError("Copies can only exist on the stack or on the battlefield.", 400);
  }

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};