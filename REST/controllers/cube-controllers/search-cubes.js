import Cube from '../../../models/cube-model.js';

// with the account page refactor, i don't believe this is being used anywhere yet
export default async function (req, res) {
  try {
    let query = req.query;
    let options = null;

    if (query.name || query.description) {
      const searchString = (query.name ? `${query.name} ` : '') + (query.description ? query.description : '');
      query.$text = { $search: searchString };
      delete query.name;
      delete query.description;
      options = { score: { $meta: 'textScore' } }
    }

    const cubes = await Cube.find(query, options);
    res.status(200).json({ cubes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};