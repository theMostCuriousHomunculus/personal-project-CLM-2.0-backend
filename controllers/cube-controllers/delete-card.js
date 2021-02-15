import HttpError from '../../models/http-error.js';
import returnComponent from '../../utils/return-component.js';

export default async function (req, res) {
  try {
    const originComponent = await returnComponent(req.cube, req.params.componentId);
    const card = originComponent.id(req.params.cardId);

    if (!card) {
      throw new HttpError('Could not find a card with the provided ID in the provided component.', 404);
    }

    originComponent.pull(req.params.cardId);

    if (req.body.destination) {
      const destinationComponent = await returnComponent(req.cube, req.body.destination);
      destinationComponent.push(card);
    }

    await req.cube.save();
    res.status(204).send();
  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).json({ message: error.message });
  }
}