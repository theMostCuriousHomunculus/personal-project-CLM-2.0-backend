import mongoose from 'mongoose';
import request from 'supertest';

import Cube from '../../models/cube-model.js';
import server from '../../server.js';
import {
  existingUser1,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('create-cube', async function () {

  const requestData = {
    description: 'A brand new cube!',
    name: 'New Cube'
  }

  // ensures an authenticated user can create a new cube and that it saves to the database correctly
  const response = await request(server)
    .post('/api/cube')
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send(requestData)
    .expect(201);

  const newCube = await Cube.findById(response.body._id);

  expect(newCube.toJSON())
    .toMatchObject({
      _id: mongoose.Types.ObjectId(response.body._id),
      creator: existingUser1._id,
      mainboard: [],
      description: requestData.description,
      modules: [],
      name: requestData.name,
      rotations: [],
      sideboard: []
    });
});