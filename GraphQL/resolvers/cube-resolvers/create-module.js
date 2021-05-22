import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { cubeID, name } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    cube.modules.push({ name });
    await cube.save();

    return cube.modules[cube.modules.length - 1];
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }

};