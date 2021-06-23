import HttpError from '../../../models/http-error.js';
import returnComponent from '../../../utils/return-component.js';
import validCardProperties from '../../../constants/valid-card-properties.js';

export default async function (parent, args, context, info) {

  const { account, cube, pubsub } = context;

  if (!account || !cube || account._id.toString() !== cube.creator.toString()) throw new HttpError("You are not authorized to edit this cube.", 401);

  const { input } = args;
  
  const component = await returnComponent(cube, input.componentID);
  const card = component.id(input.cardID);

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
  pubsub.publish(cube._id.toString(), { subscribeCube: cube });

  return card;
};