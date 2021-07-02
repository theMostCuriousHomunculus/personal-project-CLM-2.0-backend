import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, deck, pubsub } = context;

  if (!account ||
    !deck ||
    account._id.toString() !== deck.creator.toString()
  ) throw new HttpError("You are not authorized to edit this deck.", 401);

  const { cardID } = args;

  const card = deck.id(cardID);

  if (!card) {
    throw new HttpError("A card with the provided ID does not exist in this deck.", 404);
  }

  card.delete();

  await deck.save();
  pubsub.publish(deck._id.toString(), { subscribeDeck: deck });

  return true;
};