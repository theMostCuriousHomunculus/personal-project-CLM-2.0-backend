const express = require('express');

const t2 = require('../middleware/tier-2-access');
const t3 = require('../middleware/tier-3-access');
const {
    createCube,
    deleteCube,
    editCube,
    fetchCube,
    fetchCubes
} = require('../controllers/cube-controller');

const router = new express.Router();

router.delete('/', t2, deleteCube);

router.get('/:cubeId', fetchCube);

router.get('/', fetchCubes);

router.patch('/', t2, editCube);

router.post('/', t3, createCube);

module.exports = router;