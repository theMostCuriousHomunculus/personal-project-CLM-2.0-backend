import Deck from '../../../models/deck-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("You must be logged in to create a deck.", 401);

  const { input: { description, format, name } } = args;

  const deckInfo = {
    creator: context.account._id,
    description,
    name
  }

  if (format)  deckInfo.format = format.toString();

  const deck = new Deck(deckInfo);
  await deck.save();
  
  return deck;
};