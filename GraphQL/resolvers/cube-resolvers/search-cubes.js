import Cube from '../../../models/cube-model.js';

export default async function (parent, args, context, info) {
  const cubes = await Cube.find({ $search: args.search }, { $meta: 'textScore' });
  
  return cubes;
};