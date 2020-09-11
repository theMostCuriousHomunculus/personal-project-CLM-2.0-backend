const { Blog, Comment } = require('../models/blog-model');

async function createBlogPost (req, res) {
  try {
    const date = new Date();
    const blogPost = new Blog({
      author: req.user._id,
      body: req.body.body,
      comments: [],
      createdAt: date,
      image: req.body.image,
      subtitle: req.body.subtitle,
      title: req.body.title,
      updatedAt: date
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
    const remainingBlogPosts = await Blog.find().select('author createdAt image subtitle title updatedAt').sort('-createdAt');
    res.status(200).json(remainingBlogPosts);
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
      title: req.body.title,
      updatedAt: new Date()
    };
    await Blog.findByIdAndUpdate(req.params.blogPostId, changes, { new: true });
    res.status(200).json({ message: 'Blog post successfully edited!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function fetchBlogPost (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId)
      .populate({ path: 'author', select: 'avatar name' })
      .populate({ path: 'comments.author', select: 'avatar name' });
    res.status(200).json(article);
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
      .select('author createdAt image subtitle title updatedAt')
      .sort({ score: { $meta: 'textScore' } });
    } else {
      matchingBlogPosts = await Blog.find().select('author createdAt image subtitle title updatedAt').sort('-createdAt');
    }

    res.status(200).json(matchingBlogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createComment (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId);
    const comment = new Comment({
      author: req.user._id,
      body: req.body.body
    });
    article.comments.push(comment);
    await article.save();
    await article.populate({ path: 'author', select: 'avatar name' })
      .populate({ path: 'comments.author', select: 'avatar name' })
      .execPopulate();
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteComment (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId);
    article.comments.pull({ _id: req.params.commentId });
    await article.save();
    await article.populate({ path: 'author', select: 'avatar name' })
      .populate({ path: 'comments.author', select: 'avatar name' })
      .execPopulate();
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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