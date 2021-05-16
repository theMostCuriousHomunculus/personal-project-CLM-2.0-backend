import Blog from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { blogPostID, body, image, subtitle, title } } = args;
  const blogPost = await Blog.findById(blogPostID);

  if (context.account._id.toString() !== blogPost.author.toString()) {
    throw new HttpError("You are not authorized to edit this blog post.", 401);
  } else {
    try {
      blogPost = {
        ...blogPost,
        body,
        image,
        subtitle,
        title,
        updatedAt: new Date()
      };
      await blogPost.save();
      
      return blogPost;
    } catch (error) {

      if (error.code === 11000) {
        // 11000 appears to be the mongodb error code for a duplicate key
        error.message = `The provided title is already in use.  Titles must be unique.`
        error.code = 409;
      }
  
      throw error;
    }
  }
  
};