import { Cube } from '../../models/cube-model.js';

export default async function (req, res) {
  try {
    const cube = await Cube.findById(req.params.cubeId).populate({ path: 'creator', select: 'avatar name' });
    res.status(201).json(cube);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};