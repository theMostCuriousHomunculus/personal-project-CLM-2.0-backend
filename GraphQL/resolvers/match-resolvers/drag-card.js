import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, xCoordinate, yCoordinate, zIndex } } = args;
  // const card = player.battlefield.find(crd => crd._id.toString() === cardID);
  const card = player.mainboard.find(crd => crd._id.toString() === cardID);

  card.x_coordinate = xCoordinate;
  card.y_coordinate = yCoordinate;
  card.z_index = zIndex;

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};