export default async function (parent, args, context, info) {
  
  const { account } = context;

  if (!account) {
    return false;
  } else {
    account.tokens = [];
    await account.save();
    
    return true;
  }

};