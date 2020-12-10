import { Blog } from '../../models/blog-model.js';

export default async function (req, res) {
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
};