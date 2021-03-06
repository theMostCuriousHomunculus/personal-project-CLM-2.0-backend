import HttpError from '../../../models/http-error.js';
import shuffle from '../../../utils/shuffle.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  // some cards may have become visible to one or more players (perhaps because of a scry)
  for (const card of player.library) {
    card.visibility = [];
  }
  
  shuffle(player.library);
  match.log.push(`${account.name} shuffled their library.`)

  // this ensures that, once a player has finished shuffling, any cards that are meant to be placed at a particular index of their library are
  player.temporary.sort((a, b) => (a.library_position && b.library_position) ? a.library_position - b.library_position : 0);

  for (const card of player.temporary) {
    if (typeof card.library_position === "number") {
      player.library = player.library.slice(0, card.library_position)
        .concat([card])
        .concat(player.library.slice(card.library_position));
      match.log.push(`${account.name} placed ${match.players.every(plr => card.visibility.includes(plr.account)) ? card.name : 'a card'} into their library at index ${card.library_position} (the bottom card has index 0).`);
    }
  }

  player.temporary = player.temporary.filter(crd => !player.library.includes(crd));

  for (let i = 0; i < player.library.length; i++) {
    player.library[i].library_position = i;
  }

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};