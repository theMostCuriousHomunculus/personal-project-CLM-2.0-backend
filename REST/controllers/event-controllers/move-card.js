import { Event } from '../../../models/event-model.js';

export default async function (cardId, fromCards, toCards) {
  try {
    const eventId = this.socket.handshake.query.eventId;
    const userId = this.socket.handshake.query.userId;
    const event = await Event.findById(eventId);
    const player = event.players.find(function (plr) {
      return plr.account.toString() === userId;
    });
    const fromCardsClone = [...player[fromCards]];
    const indexOfCard = fromCardsClone.findIndex(function (card) {
      return card._id === cardId;
    });
    const cardToMove = fromCardsClone.splice(indexOfCard, 1);
    const toCardsClone = [...player[toCards]].concat(cardToMove);

    player[fromCards] = fromCardsClone;
    player[toCards] = toCardsClone;

    await event.save();
  } catch (error) {
    this.socket.emit('error', error);
  }
};