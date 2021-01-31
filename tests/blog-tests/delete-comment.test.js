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

  const commentToDeleteID = existingBlogPost1.comments[0]._id;
  const commentsNotToDelete = existingBlogPost1.comments.slice(1).map(comment => (
    {
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.createdAt)
    }
  ));

  // other users should not be able to delete a comment
  await request(server)
    .delete(`/api/blog/${existingBlogPost1._id}/${commentToDeleteID}`)
    .send()
    .expect(401);

  await request(server)
    .delete(`/api/blog/${existingBlogPost1._id}/${commentToDeleteID}`)
    .set('Authorization', `Bearer ${existingUser2.tokens[0].token}`)
    .send()
    .expect(401);
  
  // ensures the correctly authenticated user can delete a blog post
  await request(server)
    .delete(`/api/blog/${existingBlogPost1._id}/${commentToDeleteID}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send()
    .expect(204);

  let articleWithoutComment = await Blog.findById(existingBlogPost1._id);
  articleWithoutComment = articleWithoutComment.toJSON();

  expect(articleWithoutComment.comments)
    .not
    .toContainEqual(expect.objectContaining({
      _id: commentToDeleteID
    }));

  // should not delete other comments
  expect(articleWithoutComment.comments)
    .toEqual(commentsNotToDelete);
});