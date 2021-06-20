import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, blogPost, pubsub } = context;

  if (!blogPost) throw new HttpError("Could not find a blog post with the provided BlogPostID.", 404);

  if (account._id.toString() !== blogPost.author.toString()) throw new HttpError("You are not authorized to edit this blog post.", 401);

  const { input } = args;

  try {

    for (const field of ['body', 'image', 'subtitle', 'title']) {
      if (input[field]) blogPost[field] = input[field];
    }

    blogPost.updatedAt = new Date();

    await blogPost.save();
    pubsub.publish(blogPost._id.toString(), { subscribeBlogPost: blogPost });
    
    return blogPost;
  } catch (error) {

    if (error.code === 11000) {
      // 11000 appears to be the mongodb error code for a duplicate key
      error.message = `The provided title is already in use.  Titles must be unique.`
      error.code = 409;
    }

    throw error;
  }
  
};