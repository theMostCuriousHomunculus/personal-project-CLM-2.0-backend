import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {
  const matches = await Match.find({ players: { $elemMatch: { account: parent._id } } });

  return matches;
};