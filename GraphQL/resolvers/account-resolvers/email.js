import { defaultFieldResolver } from 'graphql';

export default async function (parent, args, context, info) {
  
  if (context.account._id.toString() !== parent._id.toString()) {
    return null;
  } else {
    return defaultFieldResolver.apply(this, [parent, args, context, info]);
  }

};