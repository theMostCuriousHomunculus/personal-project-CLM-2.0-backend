import HttpError from '../../models/http-error.js';
import returnComponent from '../../utils/return-component.js';
import validCardProperties from '../../constants/valid-card-properties.js';

export default async function (req, res) {
  try {
    const component = await returnComponent(req.cube, req.params.componentId);
    const card = component.id(req.params.cardId);

    if (!card) {
      throw new HttpError('Could not find a card with the provided ID in the provided component.', 404);
    }
    
    for (let property of validCardProperties) {
      if (typeof req.body[property.name] !== 'undefined') {
        if (property.specialNumeric && isNaN(req.body[property.name])) {
          card[property.name] = 0;
        } else {
          card[property.name] = req.body[property.name];
        }
      }
    }

    await req.cube.save();
    res.status(204).send();

  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).json({ message: error.message });
  }
}