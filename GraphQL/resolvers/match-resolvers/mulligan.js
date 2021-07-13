import HttpError from '../../../models/http-error.js';
import shuffle from '../../../utils/shuffle.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const allMaindeckedCards = [];

  function resetCard (card) {
    if (!card.isCopyToken) {
      card.controller = card.owner;
      card.counters = [];
      card.face_down = true;
      card.face_down_image = 'standard';
      card.flipped = false;
      card.library_position = null;
      card.tapped = false;
      card.targets = [];
      card.visibility = [];
      card.x_coordinate = 0;
      card.y_coordinate = 0;
      card.z_index = 0;
    }

    allMaindeckedCards.push(card);
  }

  for (const zone of ['battlefield', 'exile', 'graveyard', 'hand', 'library', 'temporary']) {
    for (const card of player[zone]) {
      resetCard(card);
    }
    player[zone] = [];
  }

  for (const card of match.stack) {
    if (card.owner.toString() === account._id.toString()) {
      resetCard(card);
    }
  }

  match.stack = match.stack.filter(card => card.owner.toString() !== account._id.toString());
  shuffle(allMaindeckedCards);
  player.hand = allMaindeckedCards.splice(0, 7);

  for (let i = 0; i < 7; i++) {
    player.hand[i].visibility = [account._id];
    player.hand[i].face_down = false;
  }

  for (let i = 0; i < allMaindeckedCards.length; i++) {
    allMaindeckedCards[i].library_position = i;
  }

  player.library = allMaindeckedCards;
  match.log.push(`${account.name} mulliganed.`);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};