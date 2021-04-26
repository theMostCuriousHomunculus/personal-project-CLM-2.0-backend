import arrayMove from 'array-move';

import { Event } from '../../models/event-model.js';

export default async function (collection, newIndex, oldIndex) {
  try {
    const eventId = this.socket.handshake.query.eventId;
    const userId = this.socket.handshake.query.userId;
    const event = await Event.findById(eventId);
    const player = event.players.find(function (plr) {
      return plr.account.toString() === userId;
    });
    player[collection] = arrayMove(player[collection], oldIndex, newIndex);

    await event.save();
  
  } catch (error) {
    this.socket.emit('error', error);
  }
};