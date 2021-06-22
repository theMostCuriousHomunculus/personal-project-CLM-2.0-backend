import HttpError from '../../../models/http-error.js';

const validCubeProperties = [
  'description',
  'name'
];

export default async function (parent, args, context, info) {

  const { account, cube, pubsub } = context;

  if (!account || !cube || account._id.toString() !== cube.creator.toString()) throw new HttpError("You are not authorized to edit this cube.", 401);

  const { input } = args;

  for (let property of validCubeProperties) {
    if (typeof input[property] !== 'undefined') cube[property] = input[property];
  }

  await cube.save();
  pubsub.publish(cube._id.toString(), { subscribeCube: cube });
    
  return cube;
};