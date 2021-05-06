import Cube from '../../../models/cube-model.js';

export default async function (parent, args, context) {
  const { _id } = parent;
  const cubes = await Cube.find({ creator: _id });

  return cubes;
};