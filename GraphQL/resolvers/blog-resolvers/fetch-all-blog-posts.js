import Blog from '../../../models/blog-model.js';

export default async function (args, req) {
  const { search } = args;
  let matchingBlogPosts;

  // not sure if the if-else is necessary; will test later
  if (search) {
    matchingBlogPosts = await Blog
      .find(
        { $text: { $search: search } },
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