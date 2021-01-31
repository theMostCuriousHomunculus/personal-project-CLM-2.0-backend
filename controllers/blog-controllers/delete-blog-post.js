import Blog from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    await Blog.findByIdAndDelete(req.params.blogPostId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};