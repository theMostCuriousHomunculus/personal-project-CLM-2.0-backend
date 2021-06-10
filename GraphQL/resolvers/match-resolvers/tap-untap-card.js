import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { _id } = args;
  // const card = player.battlefield.find(crd => crd._id.toString() === _id);
  const card = player.mainboard.find(crd => crd._id.toString() === _id);

  card.tapped = !card.tapped;

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};