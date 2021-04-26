import Cube from '../../../models/cube-model.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  const { cubeID } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === cube.creator) {
    await cube.delete();

    return true;
  } else {
    throw new HttpError("You are not authorized to delete this cube.", 401);
  }

};