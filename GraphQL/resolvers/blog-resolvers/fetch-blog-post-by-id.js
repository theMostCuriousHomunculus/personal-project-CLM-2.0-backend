import Blog from '../../../models/blog-model.js';

export default async function (parent, args, context) {
  const { blogPostID } = args;
  const article = await Blog.findById(blogPostID)
    .populate({ path: 'author', select: 'avatar name' })
    .populate({ path: 'comments.author', select: 'avatar name' });
  
  return article;
};