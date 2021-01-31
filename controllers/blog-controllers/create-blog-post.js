import Blog from '../../models/blog-model.js';

export default async function (req, res) {
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
    res.status(201).json({ _id: blogPost._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};