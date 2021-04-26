import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  
  const user = await identifyRequester(req);
  user.tokens = [];
  await user.save();
  
  return true;
};