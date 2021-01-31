import request from 'supertest';

import server from '../../server.js';
import {
  existingBlogPost1,
  existingUser1,
  existingUser2,
  setupDatabase
} from '../fixtures/test-db-setup.js';

await setupDatabase();

test('fetch-blog-post-by-id', async function () {
  const response = await request(server)
    .get(`/api/blog/${existingBlogPost1._id}`)
    .expect(200);

  expect(response.body)
    .toEqual({
      ...existingBlogPost1,
      _id: existingBlogPost1._id.toString(),
      __v: 0,
      author: {
        _id: existingUser1._id.toString(),
        avatar: existingUser1.avatar,
        name: existingUser1.name
      },
      comments: [
        {
          ...existingBlogPost1.comments[0],
          _id: existingBlogPost1.comments[0]._id.toString(),
          author: {
            _id: existingUser1._id.toString(),
            avatar: existingUser1.avatar,
            name: existingUser1.name
          }
        },
        {
          ...existingBlogPost1.comments[1],
          _id: existingBlogPost1.comments[1]._id.toString(),
          author: {
            _id: existingUser2._id.toString(),
            avatar: existingUser2.avatar,
            name: existingUser2.name
          }
        },
      ]
    });
});