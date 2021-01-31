import request from 'supertest';

import server from '../../server.js';
import {
  existingCube1,
  existingUser2,
  setupDatabase
} from '../fixtures/test-db-setup.js';

beforeEach(setupDatabase);

test('delete-cube', async function () {
  // ensures unauthenticated users and other users cannot delete a user's cube
  await request(server)
    .delete(`/api/cube/${existingCube1._id}`)
    .send()
    .expect(401);

  await request(server)
    .delete(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send()
    .expect(401);
});

test('edit-cube', async function () {
  // ensures unauthenticated users and other users cannot edit a user's cube
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .expect(401);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .expect(401);
  });