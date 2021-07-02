export default {
  subscribe: function (parent, args, context, info) {
    return context.pubsub.asyncIterator(context.deck._id.toString());
  }
};