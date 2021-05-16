import Blog from '../../../models/blog-model.js';

export default async function (parent, args, context) {
  const article = await Blog.findById(args.blogPostID)
  
  return article;
};