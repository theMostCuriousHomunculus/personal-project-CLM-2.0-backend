import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

const validModuleProperties = [
  'name'
];
const validRotationProperties = [
  'name',
  'size'
]

export default async function (parent, args, context, info) {
  const { input: { componentID, cubeID, type } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {

    if (type === 'module') {
      const module = cube.modules.id(componentID);

      for (let property of validModuleProperties) {
        if (typeof input[property] !== 'undefined') module[property] = input[property];
      }

      await cube.save();
      
      return module;
    } else if (type === 'rotation') {
      const rotation = cube.rotations.id(componentID);

      for (let property of validRotationProperties) {
        if (typeof input[property] !== 'undefined') rotation[property] = input[property];
      }

      await cube.save();

      return rotation;
    } else {
      throw new HttpError('Component type must be "module" or "rotation".', 400);
    }

  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }
}