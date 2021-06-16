import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardIDs } } = args;

  for (const cardID of cardIDs) {
    const card = player.battlefield.find(crd => crd._id.toString() === cardID);

    card.tapped = !card.tapped;
  }

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};