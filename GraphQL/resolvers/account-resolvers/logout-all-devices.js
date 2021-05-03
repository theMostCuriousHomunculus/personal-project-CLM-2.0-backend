import identifyRequester from '../../middleware/identify-requester.js';

export default async function (parent, args, context) {
  const { req } = context;
  const user = await identifyRequester(req);
  user.tokens = [];
  await user.save();
  
  return true;
};