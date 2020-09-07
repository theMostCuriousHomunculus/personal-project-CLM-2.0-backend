const express = require('express');

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

router.delete('/:blogPostId', deleteBlogPost);

router.delete('/:blogPostId/:commentId', deleteComment);

router.get('/:blogPostId', fetchBlogPost);

router.get('/', fetchBlogPosts);

router.patch('/:blogPostId', editBlogPost);

router.patch('/:blogPostId/:commentId', editComment);

router.post('/', createBlogPost);

router.post('/:blogPostId/', createComment);

module.exports = router;