import Account from '../../../models/account-model.js';
import Blog from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  const { input: { blogPostID, body, image, subtitle, title } } = args;
  const blogPost = await Blog.findById(blogPostID);
  const user = await identifyRequester(req);

  if (user._id !== blogPost.author) {
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
      
      return true;
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