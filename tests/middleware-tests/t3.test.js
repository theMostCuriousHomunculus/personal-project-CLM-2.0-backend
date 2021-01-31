import request from 'supertest';

import server from '../../server.js';
import {
  existingBlogPost1,
  setupDatabase
} from '../fixtures/test-db-setup.js';

beforeEach(setupDatabase);

test('create-cube', async function () {
  // ensures unauthenticated users cannot create cubes
  await request(server)
    .post('/api/cube')
    .expect(401);
});

test('create-comment', async function () {
  // ensures unauthenticated users cannot comment on blog posts
  await request(server)
    .post(`/api/blog/${existingBlogPost1._id}`)
    .expect(401);
});