import Cube from '../../../models/cube-model.js';

export default async function (args, req) {
  const { cubeID } = args;
  const cube = await Cube.findById(cubeID).populate({ path: 'creator', select: 'avatar name' });
    
  return cube;
};