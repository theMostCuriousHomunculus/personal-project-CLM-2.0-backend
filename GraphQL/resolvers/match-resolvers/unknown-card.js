import { defaultFieldResolver } from 'graphql';

export default async function (parent, args, context, info) {
  
  if (parent.visibility.length < context.match.players.length && (!context.account || !parent.visibility.includes(context.account._id))) {
    return null;
  } else {
    return defaultFieldResolver.apply(this, [parent, args, context, info]);
  }

};