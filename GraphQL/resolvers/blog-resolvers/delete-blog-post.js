import Blog from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const blogPost = await Blog.findById(args._id);

  if (blogPost.author.toString() === context.account._id.toString()) {
    await blogPost.delete();
  } else {
    throw new HttpError("You are not authorized to delete this blog post.", 401);
  }

  return true;
};