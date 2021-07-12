export default async function (parent, args, context, info) {

  if (parent.account.toString() === context.account._id.toString()) {
    return parent.queue[0];
  } else {
    return null;
  }

};