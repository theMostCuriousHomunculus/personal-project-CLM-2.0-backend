import request from 'supertest';

import server from '../../server.js';
import { existingCube1, existingUser1, setupDatabase } from '../fixtures/test-db-setup.js';

await setupDatabase();

test('fetch-account-by-id', async function () {
  // should send profile info WITH email address for existingUser1
  let response = await request(server)
    .get(`/api/account/${existingUser1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body)
    .toEqual({
      cubes: [{
        _id: existingCube1._id.toString(),
        description: existingCube1.description,
        mainboard: [],
        modules: [],
        name: existingCube1.name,
        rotations: []
      }],
      events: [],
      user: {
        _id: existingUser1._id.toString(),
        avatar: existingUser1.avatar,
        buds: [],
        email: existingUser1.email,
        name: existingUser1.name,
        received_bud_requests: [],
        sent_bud_requests: []
      }
    });

  // should send profile info WITHOUT email address for existingUser1
  response = await request(server)
    .get(`/api/account/${existingUser1._id}`)
    .send()
    .expect(200);

  expect(response.body)
    .toEqual({
      cubes: [{
        _id: existingCube1._id.toString(),
        description: existingCube1.description,
        mainboard: [],
        modules: [],
        name: existingCube1.name,
        rotations: []
      }],
      events: [],
      user: {
        _id: existingUser1._id.toString(),
        avatar: existingUser1.avatar,
        buds: [],
        name: existingUser1.name,
        received_bud_requests: [],
        sent_bud_requests: []
      }
    });
});