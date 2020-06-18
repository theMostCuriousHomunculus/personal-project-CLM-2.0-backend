const { Cube } = require('../models/cube-model');
const { HttpError } = require('../models/http-error');

async function createCube (req, res) {
    try {
        const cube = new Cube({
            creator: req.user._id,
            description: req.body.description,
            name: req.body.name
        });
    
        await cube.save();
        res.status(201).json({ _id: cube._id, message: 'Cube successfully created!' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

async function deleteCube (req, res) {
    await Cube.deleteOne({ _id: req.cube._id });
    res.status(200).json({ message: 'Successfully deleted the cube.' });
};

async function editCube (req, res) {

    try {

        const cardId = req.body.card_id;
        const component = req.body.component;
        let card;
        let changes = req.body;

        switch (req.body.action) {
            case 'add_card':
                
                card = req.body;
                delete card.action;
                delete card.component;
                delete card.cube_id;
                
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
                return res.status(200).json({ message: 'Card successfully added.' });

            case 'edit_card':

                card = req.body;
                // don't want to allow users to change a card's unique identifier
                delete card._id;

                if (component === 'sideboard') {
                    req.cube.sideboard.id(cardId).set(card);
                } else if (req.cube.modules.id(component)) {
                    req.cube.modules.id(component).cards.id(cardId).set(card);
                } else if (req.cube.rotations.id(component)) {
                    req.cube.rotations.id(component).cards.id(cardId).set(card);
                } else {
                    req.cube.mainboard.id(cardId).set(card);
                }

                await req.cube.save();
                return res.status(200).json({ message: 'Card successfully edited.' });

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

                const verb = destination === 'delete' ? 'deleted' : 'moved';

                await req.cube.save();
                return res.status(200).json({ message: `Card was successfully ${verb}.` });
            
            case 'add_module':
                
                req.cube.modules.push({ name: req.body.name });
                await req.cube.save();
                return res.status(200).json({
                    _id: req.cube.modules[req.cube.modules.length - 1]._id,
                    message: 'Module successfully created.'
                });

            case 'add_rotation':
    
                req.cube.rotations.push({ name: req.body.name, size: 0 });
                await req.cube.save();
                return res.status(200).json({
                    _id: req.cube.rotations[req.cube.rotations.length - 1]._id,
                    message: 'Rotation successfully created.'
                });

            case 'edit_module':

                req.cube.modules.id(component).name = req.body.name;
                req.cube.save();
                return res.status(200).json({ message: 'Module successfully edited.' });

            case 'edit_rotation':

                delete changes.action;
                delete changes.component;
                delete changes.cube_id;
                // don't want to allow users to change a rotation's unique identifier
                delete changes._id;

                req.cube.rotations.id(component).set(changes);
                req.cube.save();
                return res.status(200).json({ message: 'Rotation successfully edited.' });

            case 'delete_module':

                req.cube.modules.pull({ _id: component });
                await req.cube.save();
                return res.status(200).json({ message: 'Module successfully deleted.' });

            case 'delete_rotation':

                req.cube.rotations.pull({ _id: component });
                await req.cube.save();
                return res.status(200).json({ message: 'Rotation successfully deleted.' });

            case 'edit_cube_info':

                delete changes.action;
                // don't want to allow users to change a cube's creator property
                delete changes.creator;
                delete changes.cube_id;
                // don't want to allow users to change a cube's unique identifier
                delete changes._id;

                req.cube.set(changes);
                req.cube.save();
                return res.status(200).json({ message: 'Cube info successfully edited.' });

            default:
                throw new HttpError('Invalid action.', 400);
        }
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
    
};

async function fetchCube (req, res) {
    try {
        const cube = await Cube.findOne({ _id: req.params.cubeId });
        res.status(201).json({ cube });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function fetchCubes (req, res) {
    try {
        let query = req.query;
        let options = null;

        if (query.name || query.description) {
            const searchString = (query.name ? query.name : '') + ' ' + (query.description ? query.description : '');
            query.$text = { $search: searchString };
            delete query.name;
            delete query.description;
            options = { score: { $meta: 'textScore' } }
        }

        const cubes = await Cube.find(query, 'creator description name', options);
        res.status(200).json({ cubes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCube,
    deleteCube,
    editCube,
    fetchCube,
    fetchCubes
}