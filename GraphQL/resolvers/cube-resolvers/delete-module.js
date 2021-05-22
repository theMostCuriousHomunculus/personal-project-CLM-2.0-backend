import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { cubeID, moduleID } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    cube.modules.pull(moduleID);
    await cube.save();
    
    return true;
  } else {
    throw new HttpError("You are not authorized to delete this component.", 401);
  }

};