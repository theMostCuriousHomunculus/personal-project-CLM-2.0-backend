import HttpError from '../../models/http-error.js';

export default async function (req, res) {
  try {

    if (req.body.type === 'module') {
      req.cube.modules.pull(req.params.componentId);
      await req.cube.save();
      res.status(204).send();
    } else if (req.body.type === 'rotation') {
      req.cube.rotations.pull(req.params.componentId);
      await req.cube.save();
      res.status(204).send();
    } else {
      throw new HttpError('Component type must be "module" or "rotation".', 400);
    }

  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).json({ message: error.message });
  }
}