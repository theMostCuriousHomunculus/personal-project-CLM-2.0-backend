import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, faceDownImage, zone } } = args;
  let card;
  
  if (zone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
  } else {
    card = player[zone].find(crd => crd._id.toString() === cardID);
  }

  card.face_down_image = faceDownImage.toString();

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};