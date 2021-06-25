import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, cube, pubsub } = context;

  if (!account || !cube || account._id.toString() !== cube.creator.toString()) throw new HttpError("You are not authorized to edit this cube.", 401);

  const { input } = args;
  const rotation = cube.rotations.id(input.rotationID);
  const validRotationProperties = [
    'name',
    'size'
  ];

  for (let property of validRotationProperties) {
    if (typeof input[property] !== 'undefined') rotation[property] = input[property];
  }

  await cube.save();
  pubsub.publish(cube._id.toString(), { subscribeCube: cube });
  
  return cube;
};