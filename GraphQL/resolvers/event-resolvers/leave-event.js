export default async function (parent, args, context, info) {
  try {
    this.socket.disconnect(true);
  } catch (error) {
    this.io.to(this.socket.handshake.query.eventId).emit('error', error);
  }
};