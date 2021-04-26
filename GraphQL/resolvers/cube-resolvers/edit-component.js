import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

const validModuleProperties = [
  'name'
];
const validRotationProperties = [
  'name',
  'size'
]

export default async function (args, req) {
  const { input: { componentID, cubeID, type } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === cube.creator) {

    if (type === 'module') {

      for (let property of validModuleProperties) {
        if (typeof input[property] !== 'undefined') cube.modules.id(componentID)[property] = input[property];
      }

      await cube.save();
      
      return true;
    } else if (type === 'rotation') {

      for (let property of validRotationProperties) {
        if (typeof input[property] !== 'undefined') cube.rotations.id(componentID)[property] = input[property];
      }

      await cube.save();

      return true;
    } else {
      throw new HttpError('Component type must be "module" or "rotation".', 400);
    }

  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }
}