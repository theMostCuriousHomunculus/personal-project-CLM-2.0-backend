import { Event } from '../../models/event-model.js';

export default async function () {
  try{
    const eventId = this.socket.handshake.query.eventId;
    const userId = this.socket.handshake.query.userId;
    const event = await Event.findById(eventId).populate({ path: 'players.account', select: 'name avatar' });

    if (!userId) {
      throw new Error('You must be logged in to visit event pages.');
    } else if (!event) {
      throw new Error('Could not find an event with that ID.');
    } else if (!event.players.find(function (plr) {
      return plr.account._id.toString() === userId;
    })) {
      throw new Error('You were not invited to this event.');
    } else {

      const player = event.players.find(function (plr) {
        return plr.account._id.toString() === userId;
      });

      await event.save();

      this.socket.join(eventId);
      this.socket.join(`${eventId} - ${userId}`)

      // the event host needs a way to download a csv file for each other player that contains that player's card pool so trades can be made
      let otherPlayersCardPools = [];
      if (event.finished && event.host.toString() === userId) {
        let otherPlayers = event.players.filter(function (plr) {
          return plr.account._id.toString() !== userId;
        });
        for (let plr of otherPlayers) {
          otherPlayersCardPools.push({
            account: plr.account,
            card_pool: plr.chaff.map(function (card) {
              return card.mtgo_id;
            })
              .concat(plr.mainboard.map(function (card) {
                return card.mtgo_id;
              }))
              .concat(plr.sideboard.map(function (card) {
                return card.mtgo_id;
              }))
          });
        }
      }

      const eventData = {
        chaff: player.chaff,
        finished: event.finished,
        mainboard: player.mainboard,
        name: event.name,
        players: event.players,
        sideboard: player.sideboard
      };

      if (event.finished) {
        eventData.other_players_card_pools = otherPlayersCardPools;
        eventData.pack = [];
      } else {
        eventData.pack = (player.queue.length > 0 ? player.queue[0] : []);
      }

      this.socket.emit('admittance', eventData);
    }
  } catch (error) {
    this.socket.emit('error', error);
  }
};