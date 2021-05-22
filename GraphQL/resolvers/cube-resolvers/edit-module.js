import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { cubeID, moduleID } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    const module = cube.modules.id(moduleID);
    const validModuleProperties = [
      'name'
    ];

    for (let property of validModuleProperties) {
      if (typeof input[property] !== 'undefined') module[property] = input[property];
    }

    await cube.save();
    
    return module;
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }
};