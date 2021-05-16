import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { cubeID, name, type } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    
    if (type === 'module') {
      cube.modules.push({ name });
      await cube.save();
      return { _id: cube.modules[cube.modules.length - 1]._id };
    } else if (type === 'rotation') {
      cube.rotations.push({ name, size: 0 });
      await cube.save();
      return { _id: cube.rotations[cube.rotations.length - 1]._id };
    } else {
      throw new HttpError('Component type must be "module" or "rotation".', 400);
    }

  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }

};