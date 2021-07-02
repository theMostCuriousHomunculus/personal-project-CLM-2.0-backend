import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, deck, pubsub } = context;

  if (!account ||
    !deck ||
    account._id.toString() !== deck.creator.toString()
  ) throw new HttpError("You are not authorized to edit this deck.", 401);

  const { input: { description, format, name } } = args;

  if (typeof description !== 'undefined') deck.description = description;

  if (typeof format !== 'undefined') deck.format = format;

  if (typeof name !== 'undefined') deck.name = name;

  await deck.save();
  pubsub.publish(deck._id.toString(), { subscribeDeck: deck });
    
  return deck;
};