import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

const validCubeProperties = [
  'description',
  'name'
];

export default async function (parent, args, context, info) {
  const { input: { cubeID } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {

    for (let property of validCubeProperties) {
      if (typeof input[property] !== 'undefined') cube[property] = input[property];
    }

    await cube.save();
    
    return cube;
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }

};