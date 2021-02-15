import HttpError from '../../models/http-error.js';

const validModuleProperties = [
  'name'
];
const validRotationProperties = [
  'name',
  'size'
]

export default async function (req, res) {
  try {
    if (req.body.type === 'module') {

      for (let property of validModuleProperties) {
        if (typeof req.body[property] !== 'undefined') req.cube.modules.id(req.params.componentId)[property] = req.body[property];
      }

      await req.cube.save();
      res.status(204).send();

    } else if (req.body.type === 'rotation') {

      for (let property of validRotationProperties) {
        if (typeof req.body[property] !== 'undefined') req.cube.rotations.id(req.params.componentId)[property] = req.body[property];
      }

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