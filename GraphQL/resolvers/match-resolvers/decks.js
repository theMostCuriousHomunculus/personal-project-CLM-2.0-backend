import Deck from '../../../models/deck-model.js';

export default async function (parent, args, context, info) {
  const decks = await Deck.find({ '_id': { $in: parent.decks } });

  return decks;
};