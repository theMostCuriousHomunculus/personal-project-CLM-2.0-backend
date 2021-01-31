import Cube from '../../models/cube-model.js';

export default async function (req, res) {
  try {
    const cube = new Cube({
      creator: req.user._id,
      description: req.body.description,
      name: req.body.name
    });
  
    await cube.save();
    res.status(201).json({ _id: cube._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};