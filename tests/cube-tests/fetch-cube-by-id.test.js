import request from 'supertest';

import server from '../../server.js';
import {
  existingCube1,
  existingUser1,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('fetch-cube-by-id', async function () {
  const response = await request(server)
    .get(`/api/cube/${existingCube1._id}`)
    .expect(200);

  expect(response.body)
    .toEqual({
      ...existingCube1,
      _id: existingCube1._id.toString(),
      __v: 0,
      creator: {
        _id: existingUser1._id.toString(),
        avatar: existingUser1.avatar,
        name: existingUser1.name
      }
    });
});