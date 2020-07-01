const express = require('express');

const t3 = require('../middleware/tier-3-access');
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

router.delete('/', t3, deleteAccount);

router.get('/', fetchAccounts);

router.get('/:accountId', fetchAccount);

router.patch('/', t3, editAccount);

router.patch('/login', login);

router.patch('/logoutAll', t3, logoutAll);

router.patch('/logoutCurrent', t3, logoutThis);

router.post('/', register);

module.exports = router;