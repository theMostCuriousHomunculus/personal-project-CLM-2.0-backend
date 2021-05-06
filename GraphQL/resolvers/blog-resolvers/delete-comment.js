import Blog, { Comment } from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (parent, args, context) {
  const { input: { blogPostID, commentID } } = args;
  const { req } = context;
  const article = await Blog.findById(blogPostID);
  const comment = await Comment.findById(commentID);
  const user = await identifyRequester(req);

  if (user.admin || user._id === comment.author) {
    article.comments.pull({ _id: req.params.commentId });
    await article.save();
  } else {
    throw new HttpError("You are not authorized to delete this comment.", 401);
  }
  
  return true;
};