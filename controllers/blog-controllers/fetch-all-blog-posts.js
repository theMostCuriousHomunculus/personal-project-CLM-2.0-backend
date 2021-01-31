import Blog from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    let matchingBlogPosts;
    if (req.query.includes) {
      matchingBlogPosts = await Blog
        .find(
          { $text: { $search: req.query.includes } },
          { score: { $meta: 'textScore' } }
        )
        .select('author createdAt image subtitle title updatedAt')
        .sort({ score: { $meta: 'textScore' } });
    } else {
      matchingBlogPosts = await Blog
        .find()
        .select('author createdAt image subtitle title updatedAt')
        .sort('-createdAt');
    }

    res.status(200).json(matchingBlogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};