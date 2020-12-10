import { Blog } from '../../models/blog-model.js';

export default async function (req, res) {
  try {
    await Blog.findByIdAndDelete(req.params.blogPostId);
    // i should modify this to just send back a confirmation that the post has been deleted; no need to send back all remaining blog posts as those would have already been loaded on the front end
    const remainingBlogPosts = await Blog.find().select('author createdAt image subtitle title updatedAt').sort('-createdAt');
    res.status(200).json(remainingBlogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};