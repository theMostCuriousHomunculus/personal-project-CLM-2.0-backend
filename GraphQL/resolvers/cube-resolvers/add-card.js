import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';
import returnComponent from '../../../utils/return-component.js';
import validCardProperties from '../../../constants/valid-card-properties.js';

export default async function (args, req) {
  const { input: { componentID, cubeID } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === cube.creator) {
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

    return { _id: component[component.length - 1]._id };
  } else {
    throw new HttpError("You are not authorized to edit this cube.", 401);
  }

}