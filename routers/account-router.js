import express from 'express';

import deleteAccount from '../controllers/account-controllers/delete-account.js';
import editAccount from '../controllers/account-controllers/edit-account.js';
import fetchAccountById from '../controllers/account-controllers/fetch-account-by-id.js';
import login from '../controllers/account-controllers/login.js';
import logoutAllDevices from '../controllers/account-controllers/logout-all-devices.js';
import logoutSingleDevice from '../controllers/account-controllers/logout-single-device.js';
import register from '../controllers/account-controllers/register.js';
import requestPasswordReset from '../controllers/account-controllers/request-password-reset.js';
import searchAccounts from '../controllers/account-controllers/search-accounts.js';
import submitPasswordReset from '../controllers/account-controllers/submit-password-reset.js';
import t2 from '../middleware/tier-2-access.js';

const router = new express.Router();

router.delete('/', t2, deleteAccount);

router.get('/', searchAccounts);

router.get('/:accountId', fetchAccountById);

router.patch('/', t2, editAccount);

router.patch('/login', login);

router.patch('/logoutAll', t2, logoutAllDevices);

router.patch('/reset', requestPasswordReset);

router.patch('/reset/:resetToken', submitPasswordReset);

// this route isn't getting used anywhere and i may just remove it from the project
router.patch('/logoutSingle', t2, logoutSingleDevice);

router.post('/', register);

export default router;