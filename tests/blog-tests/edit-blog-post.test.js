import request from 'supertest';

import Blog from '../../models/blog-model.js';
import server from '../../server.js';
import {
  existingBlogPost1,
  existingUser1,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('edit-blog-post', async function () {
  const updates = {
    body: 'More sophisticated content than before.',
    image: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/0/3/03595195-3be2-4d18-b5c0-43b2dcc1c0f5.jpg?1610585956',
    subtitle: 'Wisdom to the max',
    title: 'Cube Education'
  };

  await request(server)
    .patch(`/api/blog/${existingBlogPost1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send(updates)
    .expect(204);

  const editedPost = await Blog.findById(existingBlogPost1._id);

  expect(editedPost)
    .toMatchObject(updates);
});