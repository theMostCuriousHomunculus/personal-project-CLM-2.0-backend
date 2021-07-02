import HttpError from '../../../models/http-error.js';
import shuffle from '../../../utils/shuffle.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  for (const card of player.mainboard) {
    card.visibility = [];
    card.face_down = true;
    player.library.push(card);
  }

  player.mainboard = [];
  shuffle(player.library);

  for (let i = 0; i < player.library.length; i++) {
    player.library[i].index = i;
  }

  match.log.push(`${account.name} is ready to whoop some ass!`);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};