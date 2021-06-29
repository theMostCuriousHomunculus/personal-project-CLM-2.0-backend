import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { sides } = args;
  const result = Math.floor(Math.random() * sides) + 1;

  match.log.push(`${account.name} rolled a ${sides}-sided dice and got a ${result}.`);

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};