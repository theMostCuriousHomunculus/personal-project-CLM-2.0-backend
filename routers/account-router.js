const express = require('express');

const t2 = require('../middleware/tier-2-access');
const {
  deleteAccount,
  editAccount,
  fetchAccount,
  fetchAccounts,
  login,
  logoutAll,
  logoutThis,
  register
} = require('../controllers/account-controller');

const router = new express.Router();

router.delete('/', t2, deleteAccount);

router.get('/', fetchAccounts);

router.get('/:accountId', fetchAccount);

router.patch('/', t2, editAccount);

router.patch('/login', login);

router.patch('/logoutAll', t2, logoutAll);

router.patch('/logoutCurrent', t2, logoutThis);

router.post('/', register);

module.exports = router;