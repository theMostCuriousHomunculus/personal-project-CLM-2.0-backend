import identifyRequester from '../../middleware/identify-requester.js';

export default async function (args, req) {
  const user = await identifyRequester(req);

  user.tokens = user.tokens.filter((token) => {
    return token.token !== req.header('Authorization').replace('Bearer ', '');
  });

  await user.save();
  
  return true;
};