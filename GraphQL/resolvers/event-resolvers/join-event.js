export default {
  subscribe: function (parent, args, context, info) {
    return context.pubsub.asyncIterator(context.event._id.toString());
  }
};