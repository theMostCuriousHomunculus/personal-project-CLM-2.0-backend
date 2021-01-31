import request from 'supertest';

import server from '../../server.js';
import Account from '../../models/account-model.js';
import {
  existingUser1,
  nonExistantUser,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('login', async function () {
  // should login the existing user when the correct credentials are provided
  const response = await request(server)
    .patch('/api/account/login')
    .send({
      email: existingUser1.email,
      password: existingUser1.password
    })
    .expect(200);

  const user = await Account.findById(existingUser1._id);

  // ensures the response body contains the correct data
  expect(response.body)
    .toMatchObject({
      isAdmin: user.admin,
      token: user.tokens[1].token,
      userId: user._id.toString()
    });

  // should not login existing user when the incorrect credentials are provided
  await request(server)
    .patch('/api/account/login')
    .send({
      email: existingUser1.email,
      password: 'thisIsNotTheRightPassword'
    })
    .expect(401);

  await request(server)
    .patch('/api/account/login')
    .send({
      email: 'thisIsNotTheRightEmailAddress',
      password: existingUser1.password
    })
    .expect(401);

  await request(server)
    .patch('/api/account/login')
    .send({
      email: nonExistantUser.email,
      password: nonExistantUser.password
    })
    .expect(401);
});