import Cube from '../../../models/cube-model.js';

export default async function (parent, args, context, info) {
  const cubes = await Cube.find({ creator: parent._id });

  return cubes;
};