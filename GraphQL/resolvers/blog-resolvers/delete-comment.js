import Blog, { Comment } from '../../../models/blog-model.js';
import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {
  const { input: { blogPostID, commentID } } = args;
  const article = await Blog.findById(blogPostID);
  const comment = await Comment.findById(commentID);

  if (context.account.admin || context.account._id === comment.author) {
    article.comments.pull({ _id: req.params.commentId });
    await article.save();
  } else {
    throw new HttpError("You are not authorized to delete this comment.", 401);
  }
  
  return true;
};