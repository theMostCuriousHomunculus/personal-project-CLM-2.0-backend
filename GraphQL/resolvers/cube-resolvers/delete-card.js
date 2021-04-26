import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';
import returnComponent from '../../../utils/return-component.js';

export default async function (args, req) {
  const { input: { cardID, componentID, cubeID, destination } } = args;
  const cube = await Cube.findById(cubeID);
  const user = await identifyRequester(req);

  if (user._id === cube.creator) {
    const originComponent = await returnComponent(cube, componentID);
    const card = originComponent.id(cardID);
  
    if (!card) {
      throw new HttpError('Could not find a card with the provided ID in the provided component.', 404);
    }
  
    originComponent.pull(cardID);
  
    if (destination) {
      const destinationComponent = await returnComponent(cube, destination);
      destinationComponent.push(card);
    }
  
    await req.cube.save();

    return true;
  } else {
    throw new HttpError("You are not authorized to delete this card.", 401);
  }
  
}