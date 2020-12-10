import { Cube } from '../../models/cube-model.js';

export default async function (req, res) {
  try {
    await Cube.findByIdAndDelete(req.cube._id);
    res.status(200).json({ message: 'Successfully deleted the cube.' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};