const express = require('express');

const t3 = require('../middleware/tier-3-access');
const {
  createDraft,
  fetchDraft
} = require('../controllers/draft-controller');

const router = new express.Router();

router.get('/:draftId', t3, fetchDraft);

router.post('/', t3, createDraft);

module.exports = router;