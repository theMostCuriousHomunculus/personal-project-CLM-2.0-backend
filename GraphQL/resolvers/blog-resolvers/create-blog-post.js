import Blog from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {

  const { input: { body, image, subtitle, title } } = args;
  const user = await identifyRequester(req);

  if (!user.admin) throw new HttpError("Only administrators may post articles on Cube Level Midnight.", 401);

  try {
    const date = new Date();
    const blogPost = new Blog({
      author: user._id,
      body,
      comments: [],
      createdAt: date,
      image,
      subtitle,
      title,
      updatedAt: date
    });
  
    await blogPost.save();
    
    return { _id: blogPost._id };
    
  } catch (error) {

    if (error.code === 11000) {
      // 11000 appears to be the mongodb error code for a duplicate key
      error.message = `The provided title is already in use.  Titles must be unique.`
      error.code = 409;
    }

    throw error;
  }
};