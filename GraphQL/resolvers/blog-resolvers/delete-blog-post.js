import Blog from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context) {
  const { blogPostID } = args;
  const { req } = context;
  const user = await identifyRequester(req);
  const blogPost = await Blog.findById(blogPostID);

  if (blogPost.author === user._id) {
    await blogPost.delete();
  } else {
    throw new HttpError("You are not authorized to delete this blog post.", 401);
  }

  return true;
};