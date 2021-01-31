import Blog, { Comment } from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId);
    const comment = new Comment({
      author: req.user._id,
      body: req.body.body
    });
    article.comments.push(comment);
    await article.save();
    res.status(201).json({ _id: article.comments[article.comments.length - 1]._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};