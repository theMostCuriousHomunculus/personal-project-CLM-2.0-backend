import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  const { input: { cubeID, name, type } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === cube.creator) {
    
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

}