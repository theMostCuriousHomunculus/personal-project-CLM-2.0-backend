import mongoose from 'mongoose';
import request from 'supertest';

import server from '../../server.js';
import Account from '../../models/account-model.js';
import { existingUser1, existingUser2, setupDatabase } from '../fixtures/test-db-setup.js';

await setupDatabase();

test('edit-account', async function () {
  // should update user's avatar field
  const newAvatarURL = 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/f/8/f8f3cc4f-7943-4025-b332-b40653b13014.jpg?1576384600';

  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      avatar: newAvatarURL
    })
    .expect(200);

  const userWithNewAvatar = await Account.findById(existingUser1._id);

  expect(userWithNewAvatar)
    .toMatchObject({
      avatar: newAvatarURL
    });

  // sould update email, name and password fields
  const previousHashedPassword = userWithNewAvatar.password;
  const newEmailAddress = 'carnage_tyrant@wowway.com';
  const newName = 'Karny-Tee';
  const newPassword = 'G3tWr3ckt%*';

  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      email: newEmailAddress,
      name: newName,
      password: newPassword
    })
    .expect(200);

  const userWithNewEmailNamePassword = await Account.findById(existingUser1._id);

  expect(userWithNewEmailNamePassword)
    .toMatchObject({
      email: newEmailAddress,
      name: newName
    });

  expect(userWithNewEmailNamePassword.password)
    .not
    .toBe(previousHashedPassword);

  // should prevent users from interacting with non-existant users
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      other_user_id: new mongoose.Types.ObjectId()
    })
    .expect(403);

  // should prevent users from supplying their own id as the other_user_id
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      other_user_id: existingUser1._id
    })
    .expect(403);

  // should send a bud request to existingUser2
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'send',
      other_user_id: existingUser2._id.toString()
    })
    .expect(200);

  let user1 = await Account.findById(existingUser1._id);
  let user2 = await Account.findById(existingUser2._id);

  expect(user1.sent_bud_requests)
    .toContainEqual(existingUser2._id);

  expect(user2.received_bud_requests)
    .toContainEqual(existingUser1._id);

  // should not send a bud request to existingUser2 since one has already been sent
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'send',
      other_user_id: existingUser2._id.toString()
    })
    .expect(403);

  // should not send a bud request to existingUser1 since one has already been sent
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send({
      action: 'send',
      other_user_id: existingUser1._id.toString()
    })
    .expect(403);

  // should reject existingUser1's bud request
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send({
      action: 'reject',
      other_user_id: existingUser1._id.toString()
    })
    .expect(200);
  
  user1 = await Account.findById(existingUser1._id);
  user2 = await Account.findById(existingUser2._id);

  expect(user1.sent_bud_requests)
    .not
    .toContainEqual(existingUser2._id);

  expect(user1.buds)
    .not
    .toContainEqual(existingUser2._id);

  expect(user2.received_bud_requests)
    .not
    .toContainEqual(existingUser1._id);

  expect(user2.buds)
    .not
    .toContainEqual(existingUser1._id);

  // send a bud request again (since I just deleted it to test the reject functionality)
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send({
      action: 'send',
      other_user_id: existingUser1._id.toString()
    });

  // should accept existingUser2's bud request
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'accept',
      other_user_id: existingUser2._id.toString()
    })
    .expect(200);

  user1 = await Account.findById(existingUser1._id);
  user2 = await Account.findById(existingUser2._id);

  expect(user1.received_bud_requests)
    .not
    .toContainEqual(existingUser2._id);

  expect(user1.buds)
    .toContainEqual(existingUser2._id);

  expect(user2.sent_bud_requests)
    .not
    .toContainEqual(existingUser1._id);

  expect(user2.buds)
    .toContainEqual(existingUser1._id);

  // should remove bud relationship between existingUser1 and existingUser2
  await request(server)
    .patch(`/api/account`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'remove',
      other_user_id: existingUser2._id.toString()
    })
    .expect(200);

  user1 = await Account.findById(existingUser1._id);
  user2 = await Account.findById(existingUser2._id);

  expect(user1.buds)
    .not
    .toContainEqual(existingUser2._id);

  expect(user2.buds)
    .not
    .toContainEqual(existingUser1._id);
});