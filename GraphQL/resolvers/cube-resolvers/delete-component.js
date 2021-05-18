import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { componentID, cubeID, type } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {

    if (type === 'module') {
      cube.modules.pull(componentID);
      await cube.save();
      
      return true;
    } else if (type === 'rotation') {
      cube.rotations.pull(componentID);
      await cube.save();
      
      return true;
    } else {
      throw new HttpError('Component type must be "module" or "rotation".', 400);
    }

  } else {
    throw new HttpError("You are not authorized to delete this component.", 401);
  }

}