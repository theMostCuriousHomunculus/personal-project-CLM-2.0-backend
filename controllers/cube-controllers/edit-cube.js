import { HttpError } from '../../models/http-error.js';

// modify this code; too long, some bad practices and should not send back the entire cube
export default async function (req, res) {
  try {
    const cardId = req.body.card_id;
    const component = req.body.component;
    let card;
    let changes = req.body;

    switch (req.body.action) {
      case 'add_card':
          
        card = req.body;
        // the following 3 properties are not valid properties of the card schema
        delete card.action;
        delete card.component;
        
        if (card.power && isNaN(card.power)) {
          card.power = 0;
        }
        
        if (card.toughness && isNaN(card.toughness)) {
          card.toughness = 0;
        }
        
        if (card.loyalty && isNaN(card.loyalty)) {
          card.loyalty = 0;
        }

        if (component === 'sideboard') {
          req.cube.sideboard.push(card);
        } else if (req.cube.modules.id(component)) {
          req.cube.modules.id(component).cards.push(card);
        } else if (req.cube.rotations.id(component)) {
          req.cube.rotations.id(component).cards.push(card);
        } else {
          req.cube.mainboard.push(card);
        }
        
        await req.cube.save();
        return res.status(200).json(req.cube);

      case 'edit_card':

        let cardChanges = req.body;
        // the following 4 properties are not valid properties of the card schema
        delete cardChanges.action;
        delete cardChanges.card_id;
        delete cardChanges.component;
        // don't want to allow users to change a card's unique identifier
        delete cardChanges._id;

        if (component === 'sideboard') {
          req.cube.sideboard.id(cardId).set(cardChanges);
        } else if (req.cube.modules.id(component)) {
          req.cube.modules.id(component).cards.id(cardId).set(cardChanges);
        } else if (req.cube.rotations.id(component)) {
          req.cube.rotations.id(component).cards.id(cardId).set(cardChanges);
        } else {
          req.cube.mainboard.id(cardId).set(cardChanges);
        }

        await req.cube.save();
        return res.status(200).json(req.cube);

      case 'move_or_delete_card':

        const destination = req.body.destination;

        if (component === 'sideboard') {
          card = req.cube.sideboard.id(cardId);
          req.cube.sideboard.pull({ _id: cardId });
        } else if (req.cube.modules.id(component)) {
          card = req.cube.modules.id(component).cards.id(cardId);
          req.cube.modules.id(component).cards.pull({ _id: cardId });
        } else if (req.cube.rotations.id(component)) {
          card = req.cube.rotations.id(component).cards.id(cardId);
          req.cube.rotations.id(component).cards.pull({ _id: cardId });
        } else {
          card = req.cube.mainboard.id(cardId);
          req.cube.mainboard.pull({ _id: cardId });
        }

        if (destination === 'mainboard') {
          req.cube.mainboard.push(card);
        } else if (destination === 'sideboard') {
          req.cube.sideboard.push(card);
        } else if (req.cube.modules.id(destination)) {
          req.cube.modules.id(destination).cards.push(card);
        } else if (req.cube.rotations.id(destination)) {
          req.cube.rotations.id(destination).cards.push(card);
        } else {
          // the card was deleted, not moved, so nothing more should be done
        }

        await req.cube.save();
        return res.status(200).json(req.cube);
      
      case 'add_module':
          
        req.cube.modules.push({ name: req.body.name });
        await req.cube.save();
        return res.status(200).json(req.cube);

      case 'add_rotation':

        req.cube.rotations.push({ name: req.body.name, size: 0 });
        await req.cube.save();
        return res.status(200).json(req.cube);

      case 'edit_module':

        req.cube.modules.id(component).name = req.body.name;
        req.cube.save();
        return res.status(200).json(req.cube);

      case 'edit_rotation':

        delete changes.action;
        delete changes.component;
        // don't want to allow users to change a rotation's unique identifier
        delete changes._id;

        req.cube.rotations.id(component).set(changes);
        req.cube.save();
        return res.status(200).json(req.cube);

      case 'delete_module':

        req.cube.modules.pull({ _id: component });
        await req.cube.save();
        return res.status(200).json(req.cube);

      case 'delete_rotation':

        req.cube.rotations.pull({ _id: component });
        await req.cube.save();
        return res.status(200).json(req.cube);

      case 'edit_cube_info':

        delete changes.action;
        // don't want to allow users to change a cube's creator property
        delete changes.creatorId;
        delete changes._id;

        req.cube.set(changes);
        req.cube.save();
        return res.status(200).json(req.cube);

      default:
        throw new HttpError('Invalid action.', 400);
    }
  } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
  } 
};