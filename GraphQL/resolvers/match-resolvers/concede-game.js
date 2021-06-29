import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  // currently only supporting 2 player games
  match.game_winners = match.game_winners.concat(match.players.filter(plr => plr.account.toString() !== account._id.toString()));
  match.log.push(`${account.name} has conceded from the game.`)

  // TODO: add logic to reset the board (untap all cards, return cards to mainboard / sideboards of owners, etc...)

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};