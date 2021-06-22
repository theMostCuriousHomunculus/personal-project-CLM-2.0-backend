import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, cube, pubsub } = context;

  if (!account || !cube || account._id.toString() !== cube.creator.toString()) throw new HttpError("You are not authorized to edit this cube.", 401);

  const { name } = args;

  cube.modules.push({ name });
  
  await cube.save();
  pubsub.publish(cube._id.toString(), { subscribeCube: cube });

  return cube;
};