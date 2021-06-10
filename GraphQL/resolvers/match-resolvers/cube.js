import Cube from '../../../models/cube-model.js';

export default async function (parent, args, context, info) {
  const cube = await Cube.findById(parent.cube);

  return cube;
};