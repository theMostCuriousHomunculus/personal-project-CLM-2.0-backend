import { Cube } from '../../models/cube-model.js';

export default async function (req, res) {
  try {
    const cube = new Cube({
      creatorId: req.user._id,
      description: req.body.description,
      name: req.body.name
    });
  
    await cube.save();
    res.status(201).json({ _id: cube._id, message: 'Cube successfully created!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};