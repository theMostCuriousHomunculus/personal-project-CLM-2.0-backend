import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  const { input: { componentID, cubeID, type } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === cube.creator) {

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