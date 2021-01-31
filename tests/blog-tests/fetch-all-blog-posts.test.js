import request from 'supertest';

import server from '../../server.js';
import {
  existingBlogPost1,
  existingBlogPost2,
  existingUser1,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('fetch-all-blog-posts', async function () {
  const response = await request(server)
    .get('/api/blog')
    .expect(200);

  expect(response.body)
    .toEqual([
      {
        _id: existingBlogPost2._id.toString(),
        author: existingUser1._id.toString(),
        createdAt: existingBlogPost2.createdAt,
        image: existingBlogPost2.image,
        subtitle: existingBlogPost2.subtitle,
        title: existingBlogPost2.title,
        updatedAt: existingBlogPost2.updatedAt,
      },
      {
      _id: existingBlogPost1._id.toString(),
      author: existingUser1._id.toString(),
      createdAt: existingBlogPost1.createdAt,
      image: existingBlogPost1.image,
      subtitle: existingBlogPost1.subtitle,
      title: existingBlogPost1.title,
      updatedAt: existingBlogPost1.updatedAt,
    }]);
});