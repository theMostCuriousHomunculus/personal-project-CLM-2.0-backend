export default async function (parent, args, context, info) {
  const { account } = context;

  if (!account) {
    return false;
  } else {
    account.tokens = account.tokens.filter((token) => {
      return token.token !== context.token;
    });
  
    await account.save();
    
    return true;
  }

};