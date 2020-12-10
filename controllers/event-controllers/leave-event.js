export default async function leave () {
  try {
    this.socket.disconnect(true);
  } catch (error) {
    this.io.to(this.socket.handshake.query.eventId).emit('error', error);
  }
};