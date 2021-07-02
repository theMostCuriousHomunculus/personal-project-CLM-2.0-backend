import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, deck, pubsub } = context;

  if (!account ||
    !deck ||
    account._id.toString() !== deck.creator.toString()
  ) throw new HttpError("You are not authorized to edit this deck.", 401);

  const { input: { card, component, numberOfCopies } } = args;

  for (let i = 0; i < numberOfCopies; i++) {
    deck[component].push(card);
  }

  await deck.save();
  pubsub.publish(deck._id.toString(), { subscribeDeck: deck });

  return deck;
};