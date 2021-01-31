import mongoose from 'mongoose';
import request from 'supertest';

import Blog from '../../models/blog-model.js';
import server from '../../server.js';
import {
  existingBlogPost1,
  existingUser2,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('create-comment', async function () {

  const requestData = {
    body: 'A really profound comment'
  }

  // ensures an authenticated user can comment on a blog post and that it saves to the database correctly (existingUser2 is not the author of the blog post or even a site administrator)
  const response = await request(server)
    .post(`/api/blog/${existingBlogPost1._id}`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send(requestData)
    .expect(201);

  let updatedBlogPost = await Blog.findById(existingBlogPost1._id);
  updatedBlogPost = updatedBlogPost.toJSON();

  expect(updatedBlogPost.comments)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response.body._id),
      author: existingUser2._id,
      body: requestData.body,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
});