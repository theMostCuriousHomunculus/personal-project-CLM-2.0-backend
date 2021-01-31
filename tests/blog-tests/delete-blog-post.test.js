import request from 'supertest';

import Blog from '../../models/blog-model.js';
import server from '../../server.js';
import {
  existingBlogPost1,
  existingUser1,
  existingUser2,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('delete-cube', async function () {
  // other users should not be able to delete a blog post
  await request(server)
    .delete(`/api/blog/${existingBlogPost1._id}`)
    .send()
    .expect(401);

  await request(server)
    .delete(`/api/blog/${existingBlogPost1._id}`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send()
    .expect(401);
  
  // ensures the correctly authenticated user can delete a blog post
  await request(server)
    .delete(`/api/blog/${existingBlogPost1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send()
    .expect(204);

  const nill = await Blog.findById(existingBlogPost1._id);
  expect(nill)
    .toBeNull();
});