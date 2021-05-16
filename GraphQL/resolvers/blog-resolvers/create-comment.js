import Blog, { Comment } from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { account } = context;

  if (!account) throw new HttpError("You must be logged in to comment on posts.", 401);

  const { body, blogPostID } = args;
  const blogPost = await Blog.findById(blogPostID);
  const comment = new Comment({
    author: account._id,
    body
  });
  blogPost.comments.push(comment);
  await blogPost.save();

  return blogPost;
};