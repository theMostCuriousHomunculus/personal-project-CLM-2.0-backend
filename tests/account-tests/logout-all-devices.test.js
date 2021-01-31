import request from 'supertest';

import server from '../../server.js';
import Account from '../../models/account-model.js';
import { existingUser1, setupDatabase } from '../fixtures/test-db-setup.js';

await setupDatabase();

test('logout-all-devices', async function () {
  await request(server)
    .patch('/api/account/logoutAll')
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await Account.findById(existingUser1._id);

  // ensures tokens are removed from the server
  expect(user.tokens.length)
    .toBe(0);
});