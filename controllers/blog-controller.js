const { Blog } = require('../models/blog-model');

async function createBlogPost (req, res) {
  try {
    const blogPost = new Blog({
      authorId: req.user._id,
      // authorId: req.body.authorId,
      body: req.body.body,
      comments: [],
      image: req.body.image,
      subtitle: req.body.subtitle,
      title: req.body.title
    });
  
    await blogPost.save();
    res.status(201).json({ _id: blogPost._id, message: 'Blog post successfully created!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteBlogPost (req, res) {
  try {
    await Blog.findByIdAndDelete(req.params.blogPostId);
    res.status(200).json({ message: "Successfully deleted the blog post." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function editBlogPost (req, res) {
  try {
    const changes = {
      body: req.body.body,
      image: req.body.image,
      subtitle: req.body.subtitle,
      title: req.body.title
    };
    await Blog.findByIdAndUpdate(req.params.blogPostId, changes, { new: true });
    res.status(200).json({ message: 'Blog post successfully edited!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function fetchBlogPost (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId).populate({ path: 'author', select: 'avatar name' });
    const author = article.author;
    res.status(200).json({ article, author });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function fetchBlogPosts (req, res) {
  try {
    let matchingBlogPosts;
    if (req.query.includes) {
      matchingBlogPosts = await Blog.find(
        { $text: { $search: req.query.includes } },
        { score: { $meta: 'textScore' } }
      )
      .select('createdAt image subtitle title updatedAt')
      .sort({ score: { $meta: 'textScore' } });
    } else {
      matchingBlogPosts = await Blog.find().select('createdAt image subtitle title updatedAt').sort('-createdAt');
    }

    res.status(200).json(matchingBlogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createComment (req, res) {
  res.status(200).json({ id: req.params.blogPostId, message: "Create Comment Works!" });
}

async function deleteComment (req, res) {
  res.status(200).json({ id: `${req.params.blogPostId} + ${req.params.commentId}`, message: "Delete Comment Works!" });
}

async function editComment (req, res) {
  res.status(200).json({ id: `${req.params.blogPostId} + ${req.params.commentId}`, message: "Edit Comment Works!" });
}

module.exports = {
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  fetchBlogPost,
  fetchBlogPosts,
  createComment,
  deleteComment,
  editComment
}