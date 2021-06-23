import Cube from '../../../models/cube-model.js';
import HttpError from '../../../models/http-error.js';
import returnComponent from '../../../utils/return-component.js';

export default async function (parent, args, context, info) {

  const { account, cube, pubsub } = context;

  if (!account || !cube || account._id.toString() !== cube.creator.toString()) throw new HttpError("You are not authorized to edit this cube.", 401);

  const { input: { cardID, destinationID, originID } } = args;

  const originComponent = await returnComponent(cube, originID);
  const card = originComponent.id(cardID);

  if (!card) {
    throw new HttpError("Could not find a card with the provided ID in the provided component.", 404);
  }

  originComponent.pull(cardID);

  if (destinationID) {
    const destinationComponent = await returnComponent(cube, destinationID);
    destinationComponent.push(card);
  }

  await cube.save();
  pubsub.publish(cube._id.toString(), { subscribeCube: cube });

  return true;
};