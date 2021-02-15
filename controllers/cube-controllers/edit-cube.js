const validCubeProperties = [
  'description',
  'name'
];

export default async function (req, res) {
  try {

    for (let property of validCubeProperties) {
      if (typeof req.body[property] !== 'undefined') req.cube[property] = req.body[property];
    }

    await req.cube.save();
    res.status(204).send();

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  } 
};