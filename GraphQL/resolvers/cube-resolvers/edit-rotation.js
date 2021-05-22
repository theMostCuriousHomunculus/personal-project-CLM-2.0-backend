import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { cubeID, rotationID } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    const rotation = cube.rotations.id(rotationID);
    const validRotationProperties = [
      'name',
      'size'
    ];

    for (let property of validRotationProperties) {
      if (typeof input[property] !== 'undefined') rotation[property] = input[property];
    }

    await cube.save();

    return rotation;
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }
};