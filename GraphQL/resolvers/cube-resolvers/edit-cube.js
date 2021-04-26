import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

const validCubeProperties = [
  'description',
  'name'
];

export default async function (args, req) {
  const { input: { cubeID } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === user.creator) {

    for (let property of validCubeProperties) {
      if (typeof input[property] !== 'undefined') cube[property] = input[property];
    }

    await cube.save();
    
    return true;
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }

};