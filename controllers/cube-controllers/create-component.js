import HttpError from '../../models/http-error.js';

export default async function (req, res) {
  try {

    if (req.body.type === 'module') {
      req.cube.modules.push({ name: req.body.name });
      await req.cube.save();
      res.status(201).json({ _id: req.cube.modules[req.cube.modules.length - 1]._id });
    } else if (req.body.type === 'rotation') {
      req.cube.rotations.push({ name: req.body.name, size: 0 });
      await req.cube.save();
      res.status(201).json({ _id: req.cube.rotations[req.cube.rotations.length - 1]._id });
    } else {
      throw new HttpError('Component type must be "module" or "rotation".', 400);
    }

  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).json({ message: error.message });
  }
}