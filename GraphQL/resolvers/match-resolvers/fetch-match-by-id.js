import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  const match = await Match.findById(args._id);

  if (!match) throw new HttpError("Could not find a match with the provided ID.", 404);
    
  return match;
};