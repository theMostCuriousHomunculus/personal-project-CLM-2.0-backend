import Cube from '../../../models/cube-model.js';

export default async function (args, req) {
  const { search } = args;
  const cubes = await Cube.find({ $search: search }, { $meta: 'textScore' });
  
  return cubes;
};