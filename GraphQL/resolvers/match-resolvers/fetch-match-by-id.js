import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { match } = context;

  if (!match) throw new HttpError("Could not find a match with the provided ID.", 404);
    
  return match;
};