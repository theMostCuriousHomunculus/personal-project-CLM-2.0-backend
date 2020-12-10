import { Blog } from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    const article = await Blog.findById(req.params.blogPostId);
    article.comments.pull({ _id: req.params.commentId });
    await article.save();
    // shouldn't be sending back the whole article; just a confirmation that the comment was successfully deleted
    await article.populate({ path: 'author', select: 'avatar name' })
      .populate({ path: 'comments.author', select: 'avatar name' })
      .execPopulate();
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};