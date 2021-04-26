import express from 'express';

import createBlogPost from '../controllers/blog-controllers/create-blog-post.js';
import createComment from '../controllers/blog-controllers/create-comment.js';
import deleteBlogPost from '../controllers/blog-controllers/delete-blog-post.js';
import deleteComment from '../controllers/blog-controllers/delete-comment.js';
import editBlogPost from '../controllers/blog-controllers/edit-blog-post.js';
import fetchAllBlogPosts from '../controllers/blog-controllers/fetch-all-blog-posts.js';
import fetchBlogPostById from '../controllers/blog-controllers/fetch-blog-post-by-id.js';
import t1 from '../middleware/tier-1-access.js';
import t2 from '../middleware/tier-2-access.js';
import t3 from '../middleware/tier-3-access.js';

const router = new express.Router();

router.delete('/:blogPostId', t2, deleteBlogPost);

router.delete('/:blogPostId/:commentId', t2, deleteComment);

router.get('/:blogPostId', fetchBlogPostById);

router.get('/', fetchAllBlogPosts);

// have not set this route up yet
// router.patch('/:blogPostId/:commentId', editComment);

router.patch('/:blogPostId', t2, editBlogPost);

router.post('/:blogPostId', t3, createComment);

router.post('/', t1, createBlogPost);

export default router;