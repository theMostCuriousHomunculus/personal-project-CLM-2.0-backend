import { Blog, Comment } from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId);
    const comment = new Comment({
      author: req.user._id,
      body: req.body.body
    });
    article.comments.push(comment);
    await article.save();
    // should probably tweek this; no need to send back the whole article, just a confirmation that the comment was successfully added
    await article.populate({ path: 'author', select: 'avatar name' })
      .populate({ path: 'comments.author', select: 'avatar name' })
      .execPopulate();
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};