import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { deck } = context;

  if (!deck) throw new HttpError("Could not find a deck with the provided ID.", 404);
    
  return deck;
};