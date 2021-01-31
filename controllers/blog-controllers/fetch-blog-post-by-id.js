import Blog from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId)
      .populate({ path: 'author', select: 'avatar name' })
      .populate({ path: 'comments.author', select: 'avatar name' });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};