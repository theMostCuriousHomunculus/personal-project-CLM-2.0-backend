// account resolvers
// import deleteAccount from './account-resolvers/delete-account.js';
import editAccount from './account-resolvers/edit-account.js';
import fetchAccountByID from './account-resolvers/fetch-account-by-id.js';
import login from './account-resolvers/login.js';
import logoutAllDevices from './account-resolvers/logout-all-devices.js';
import logoutSingleDevice from './account-resolvers/logout-single-device.js';
import register from './account-resolvers/register.js';
import requestPasswordReset from './account-resolvers/request-password-reset.js';
import searchAccounts from './account-resolvers/search-accounts.js';
import submitPasswordReset from './account-resolvers/submit-password-reset.js';

// event resolvers
import count from './event-resolvers/select-card.js';

export default {
  // account resolvers
  // deleteAccount,
  editAccount,
  fetchAccountByID,
  login,
  logoutAllDevices,
  logoutSingleDevice,
  register,
  requestPasswordReset,
  searchAccounts,
  submitPasswordReset,
  // event resolvers
  count
};