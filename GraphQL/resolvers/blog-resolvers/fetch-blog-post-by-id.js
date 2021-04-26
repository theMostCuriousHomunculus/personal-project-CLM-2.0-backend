import Blog from '../../../models/blog-model.js';

export default async function (args, req) {
  const { blogPostID } = args;
  const article = await Blog.findById(blogPostID)
    .populate({ path: 'author', select: 'avatar name' })
    .populate({ path: 'comments.author', select: 'avatar name' });
  
  return article;
};