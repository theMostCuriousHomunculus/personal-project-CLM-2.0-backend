import mongoose from 'mongoose';
import request from 'supertest';

import Blog from '../../models/blog-model.js';
import server from '../../server.js';
import {
  existingUser1,
  existingUser2,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('create-blog-post', async function () {

  const requestData = {
    body: 'A second fabulous blog post',
    image: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/2/b/2bca6f8b-6e6a-43dd-b6a4-9eedfcc24281.jpg?1568004466',
    subtitle: 'Really nice',
    title: 'Post Number 2'
  }

  // ensures unauthenticated and non-admin users cannot create blog posts
  await request(server)
    .post('/api/blog')
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send(requestData)
    .expect(401);

  await request(server)
    .post('/api/blog')
    .send(requestData)
    .expect(401);

  // ensures an admin can create a new blog post and that it saves to the database correctly
  const response = await request(server)
    .post('/api/blog')
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send(requestData)
    .expect(201);

  const newBlogPost = await Blog.findById(response.body._id);

  expect(newBlogPost.toJSON())
    .toEqual({
      __v: 0,
      _id: mongoose.Types.ObjectId(response.body._id),
      author: existingUser1._id,
      body: requestData.body,
      comments: [],
      createdAt: expect.any(Date),
      image: requestData.image,
      subtitle: requestData.subtitle,
      title: requestData.title,
      updatedAt: expect.any(Date)
    });
});