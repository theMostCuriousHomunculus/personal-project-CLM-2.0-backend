import Blog, { Comment } from '../../../models/blog-model.js';
import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  const { body, blogPostID } = args;
  const user = await identifyRequester(req);
  const article = await Blog.findById(blogPostID);
  const comment = new Comment({
    author: user._id,
    body
  });
  article.comments.push(comment);
  await article.save();

  return { _id: article.comments[article.comments.length - 1]._id };
};