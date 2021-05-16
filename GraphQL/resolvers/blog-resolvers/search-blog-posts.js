import Blog from '../../../models/blog-model.js';

export default async function (parent, args, context, info) {

  let matchingBlogPosts;

  // not sure if the if-else is necessary; will test later
  if (args.search) {
    matchingBlogPosts = await Blog
      .find(
        { $text: { $search: args.search } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } });
  } else {
    matchingBlogPosts = await Blog
      .find()
      .sort('-createdAt');
  }

  return matchingBlogPosts;
};