import HttpError from '../../../models/http-error.js';
import returnComponent from '../../../utils/return-component.js';
import validCardProperties from '../../../constants/valid-card-properties.js';

export default async function (parent, args, context, info) {

  const { account, cube, pubsub } = context;
  const { input: { componentID } } = args;

  if (account._id.toString() !== cube.creator.toString()) throw new HttpError("You are not authorized to edit this cube.", 401);

  const component = await returnComponent(cube, componentID);
  const card = {};
  
  for (let property of validCardProperties) {
    if (typeof input[property.name] !== 'undefined') {
      if (property.specialNumeric && isNaN(input[property.name])){
        card[property.name] = 0;
      } else {
        card[property.name] = input[property.name];
      }
    }
  }

  component.push(card);

  await cube.save();
  pubsub.publish(cube._id.toString(), { subscribeToCube: cube });

  return cube;
};