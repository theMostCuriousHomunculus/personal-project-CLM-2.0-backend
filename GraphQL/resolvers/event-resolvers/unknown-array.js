import { defaultFieldResolver } from 'graphql';

export default async function (parent, args, context, info) {

  if ([parent.account.toString(), context.event.host.toString()].includes(context.account._id.toString())) {
    return defaultFieldResolver.apply(this, [parent, args, context, info]);
  } else {
    return null;
  }

};