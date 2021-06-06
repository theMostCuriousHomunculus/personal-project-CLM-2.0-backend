import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { cardID, cardControllerID, matchID, numberOfCopies, zone } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const cardController = match.players.find(plr => plr.account.toString() === cardControllerID);
  const card = cardController[zone].find(crd => crd._id.toString() === cardID);
  const copyOwner = match.players.find(plr => plr.account === context.account._id);

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
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};