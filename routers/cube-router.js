import express from 'express';

import createCube from '../controllers/cube-controllers/create-cube.js';
import deleteCube from '../controllers/cube-controllers/delete-cube.js';
import editCube from '../controllers/cube-controllers/edit-cube.js';
import fetchCubeById from '../controllers/cube-controllers/fetch-cube-by-id.js';
import t2 from '../middleware/tier-2-access.js';
import t3 from '../middleware/tier-3-access.js';

const router = new express.Router();

router.delete('/:cubeId', t2, deleteCube);

router.get('/:cubeId', fetchCubeById);

// not being used anywhere on the front end yet
// router.get('/', require('../controllers/cube-controllers/search-cubes'));

router.patch('/:cubeId', t2, editCube);

router.post('/', t3, createCube);

export default router;