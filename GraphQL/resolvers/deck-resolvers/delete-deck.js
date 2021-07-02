import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  
  const { account, deck } = context;

  if (!account ||
    !deck ||
    account._id.toString() !== deck.creator.toString()
  ) throw new HttpError("You are not authorized to edit this deck.", 401);

  await deck.delete();

  return true;
};