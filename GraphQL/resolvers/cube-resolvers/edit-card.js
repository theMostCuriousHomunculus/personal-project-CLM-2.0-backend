import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import returnComponent from '../../../utils/return-component.js';
import validCardProperties from '../../../constants/valid-card-properties.js';

export default async function (parent, args, context, info) {
  const { input: { cardID, componentID, cubeID } } = args;
  const cube = await Cube.findById(cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    const component = await returnComponent(cube, componentID);
    const card = component.id(cardID);

    if (!card) {
      throw new HttpError("Could not find a card with the provided ID in the provided component.", 404);
    }
    
    for (let property of validCardProperties) {
      if (typeof input[property.name] !== 'undefined') {
        if (property.specialNumeric && isNaN(input[property.name])) {
          card[property.name] = 0;
        } else {
          card[property.name] = input[property.name];
        }
      }
    }

    await cube.save();

    return card;
  } else {
    throw new HttpError("You are not authorized to edit this card.", 401);
  }
  
}