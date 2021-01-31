import mongoose from 'mongoose';
import request from 'supertest';

import server from '../../server.js';
import Account from '../../models/account-model.js';
import { existingUser1, setupDatabase } from '../fixtures/test-db-setup.js';

await setupDatabase();

test('register', async function () {
  const goodRequestData = {
    avatar: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/b/dbc0d2c3-8060-4155-b10e-d641648a4e6b.jpg?1581481106',
    email: 'kunoros_hound_of_athreos@hotmail.com',
    name: 'K-Dawg',
    password: 'y0ud34d81tch!'
  };

  await request(server)
    .post('/api/account')
    .send({
      avatar: "ThisAvatarDoesn'tMatter",
      email: existingUser1.email,
      name: "ThisNameDoesn'tMatter",
      password: "ThisPasswordDoesn'tMatter"
    })
    .expect(409);

  await request(server)
    .post('/api/account')
    .send({
      avatar: "ThisAvatarDoesn'tMatter",
      email: "ThisEmailDoesn'tMatter",
      name: existingUser1.name,
      password: "ThisPasswordDoesn'tMatter"
    })
    .expect(409);

  const response = await request(server)
    .post('/api/account')
    .send(goodRequestData)
    .expect(201);
  
  const user = await Account.findById(response.body.userId);

  // ensures the new user was created and saved to the database correctly
  expect(user.toJSON())
    .toMatchObject({
      _id: mongoose.Types.ObjectId(response.body.userId),
      admin: false,
      avatar: goodRequestData.avatar,
      email: goodRequestData.email,
      name: goodRequestData.name
    });

  // implies the password is being hashed
  expect(user.password)
    .not
    .toBe(goodRequestData.password);

  // ensures the response body contains the correct data
  expect(response.body)
    .toMatchObject({
      token: user.tokens[0].token,
      userId: user._id.toString()
    });
});