import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { token, numberOfTokens } } = args;

  for (let i = 0; i < numberOfTokens; i++) {
    player.battlefield.push({
      back_image: token.back_image,
      controller: account._id,
      counters: [],
      image: token.image,
      isCopyToken: true,
      name: token.name,
      owner: account._id,
      visibility: match.players.map(plr => plr.account),
      x_coordinate: i,
      y_coordinate: i
    });
  }

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};