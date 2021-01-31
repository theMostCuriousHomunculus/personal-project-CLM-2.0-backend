import Cube from '../../models/cube-model.js';

export default async function (req, res) {
  try {
    await Cube.findByIdAndDelete(req.cube._id);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};