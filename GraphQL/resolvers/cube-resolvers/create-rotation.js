import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { cubeID, name, size } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    cube.rotations.push({ name, size: size ? size : 0 });
    await cube.save();

    return cube.rotations[cube.rotations.length - 1];
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }

};