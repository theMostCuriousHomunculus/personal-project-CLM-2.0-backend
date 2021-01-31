import request from 'supertest';

import Cube from '../../models/cube-model.js';
import server from '../../server.js';
import {
  existingCube1,
  existingUser1,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('delete-cube', async function () {
  // ensures the correctly authenticated user can delete a cube
  await request(server)
    .delete(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send()
    .expect(200);

  const nill = await Cube.findById(existingCube1._id);
  expect(nill)
    .toBeNull();
});