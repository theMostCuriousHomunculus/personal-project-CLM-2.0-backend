import HttpError from '../../models/http-error.js';
import returnComponent from '../../utils/return-component.js';

class CardProperty {
  constructor(name, specialNumeric) {
    this.name = name;
    this.specialNumeric = specialNumeric;
  }
}

export default async function (req, res) {
  const validCardProperties = [
    new CardProperty('back_image', false),
    new CardProperty('chapters', false),
    new CardProperty('cmc', false),
    new CardProperty('color_identity', false),
    new CardProperty('image', false),
    new CardProperty('keywords', false),
    new CardProperty('loyalty', true),
    new CardProperty('mana_cost', false),
    new CardProperty('mtgo_id', false),
    new CardProperty('name', false),
    new CardProperty('oracle_id', false),
    new CardProperty('power', true),
    new CardProperty('printing', false),
    new CardProperty('purchase_link', false),
    new CardProperty('toughness', true),
    new CardProperty('type_line', false)
  ];
  const validCubeProperties = [
    'description',
    'name'
  ];
  const validModuleProperties = [
    'name'
  ];
  const validRotationProperties = [
    'name',
    'size'
  ]
  let card;
  let component;

  try {
    switch (req.body.action) {
      case 'add_card':

        component = await returnComponent(req.cube, req.body.component);
        card = {};
        
        for (let property of validCardProperties) {
          if (typeof req.body[property.name] !== 'undefined') {
            if (property.specialNumeric && isNaN(req.body[property.name])){
              card[property.name] = 0;
            } else {
              card[property.name] = req.body[property.name];
            }
          }
        }

        component.push(card);
        await req.cube.save();
        res.status(201).json({ _id: component[component.length - 1]._id });
        break;

      case 'edit_card':

        component = await returnComponent(req.cube, req.body.component);
        card = component.id(req.body.cardId);

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
        break;

      case 'move_or_delete_card':

        component = await returnComponent(req.cube, req.body.component);
        card = component.id(req.body.cardId);

        if (!card) {
          throw new HttpError('Could not find a card with the provided ID in the provided component.', 404);
        }

        component.pull(req.body.cardId);

        if (req.body.destination) {
          const destination = await returnComponent(req.cube, req.body.destination);
          destination.push(card);
        }

        await req.cube.save();
        res.status(204).send();
        break;
      
      case 'add_module':
        
        req.cube.modules.push({ name: req.body.name });
        await req.cube.save();
        res.status(201).json({ _id: req.cube.modules[req.cube.modules.length - 1]._id });
        break;

      case 'add_rotation':

        req.cube.rotations.push({ name: req.body.name, size: 0 });
        await req.cube.save();
        res.status(201).json({ _id: req.cube.rotations[req.cube.rotations.length - 1]._id });
        break;

      case 'edit_module':

        for (let property of validModuleProperties) {
          if (typeof req.body[property] !== 'undefined') req.cube.modules.id(req.body.component)[property] = req.body[property];
        }

        await req.cube.save();
        res.status(204).send();
        break;

      case 'edit_rotation':

        for (let property of validRotationProperties) {
          if (typeof req.body[property] !== 'undefined') req.cube.rotations.id(req.body.component)[property] = req.body[property];
        }

        await req.cube.save();
        res.status(204).send();
        break;

      case 'delete_module':

        req.cube.modules.pull(req.body.component);
        await req.cube.save();
        res.status(204).send();
        break;

      case 'delete_rotation':

        req.cube.rotations.pull(req.body.component);
        await req.cube.save();
        res.status(204).send();
        break;

      case 'edit_cube_info':

        for (let property of validCubeProperties) {
          if (typeof req.body[property] !== 'undefined') req.cube[property] = req.body[property];
        }

        await req.cube.save();
        res.status(204).send();
        break;

      default:
        throw new HttpError('Invalid action.', 400);
    }

  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).json({ message: error.message });
  } 
};