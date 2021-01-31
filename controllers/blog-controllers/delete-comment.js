import Blog from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId);
    article.comments.pull({ _id: req.params.commentId });
    await article.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};