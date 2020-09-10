const express = require('express');

const t1 = require('../middleware/tier-1-access');
const t2 = require('../middleware/tier-2-access');
const t3 = require('../middleware/tier-3-access');
const {
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  fetchBlogPost,
  fetchBlogPosts,
  createComment,
  deleteComment,
  editComment
} = require('../controllers/blog-controller');

const router = new express.Router();

router.delete('/:blogPostId', t2, deleteBlogPost);

router.delete('/:blogPostId/:commentId', deleteComment);

router.get('/:blogPostId', fetchBlogPost);

router.get('/', fetchBlogPosts);

router.patch('/:blogPostId/:commentId', editComment);

router.patch('/:blogPostId', t2, editBlogPost);

router.post('/:blogPostId', t3, createComment);

router.post('/', t1, createBlogPost);

module.exports = router;