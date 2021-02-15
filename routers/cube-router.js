import express from 'express';

import addCard from '../controllers/cube-controllers/add-card.js';
import createComponent from '../controllers/cube-controllers/create-component.js';
import createCube from '../controllers/cube-controllers/create-cube.js';
import deleteCard from '../controllers/cube-controllers/delete-card.js';
import deleteComponent from '../controllers/cube-controllers/delete-component.js';
import deleteCube from '../controllers/cube-controllers/delete-cube.js';
import editCard from '../controllers/cube-controllers/edit-card.js';
import editComponent from '../controllers/cube-controllers/edit-component.js';
import editCube from '../controllers/cube-controllers/edit-cube.js';
import fetchCubeById from '../controllers/cube-controllers/fetch-cube-by-id.js';
import t2 from '../middleware/tier-2-access.js';
import t3 from '../middleware/tier-3-access.js';

const router = new express.Router();

router.delete('/:cubeId', t2, deleteCube);

router.delete('/:cubeId/:componentId', t2, deleteComponent);

router.delete('/:cubeId/:componentId/:cardId', t2, deleteCard);

router.get('/:cubeId', fetchCubeById);

// not being used anywhere on the front end yet
// router.get('/', require('../controllers/cube-controllers/search-cubes'));

router.patch('/:cubeId', t2, editCube);

router.patch('/:cubeId/:componentId', t2, editComponent);

router.patch('/:cubeId/:componentId/:cardId', t2, editCard);

router.post('/', t3, createCube);

router.post('/:cubeId', t2, createComponent);

router.post('/:cubeId/:componentId', t2, addCard);

export default router;