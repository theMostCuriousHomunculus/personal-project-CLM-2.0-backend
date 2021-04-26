// import { PubSub } from 'graphql-subscriptions';
// import { Event } from '../../../models/event-model.js';

// const pubsub = new PubSub();

export default {
  count: {
    subscribe(args, context) {
      const { pubsub } = context;
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish('count', {
          count
        })
      }, 1000);

      return pubsub.asyncIterator('count');
    }
  }
};

// export default async function (cardId) {
//   // this is not currently sending the other drafters picks (must manually refresh page to get them); need to fix this
//   const eventId = this.socket.handshake.query.eventId;
//   const userId = this.socket.handshake.query.userId;

//   try {
//     const event = await Event.findById(eventId);
//     const player = event.players.find(function (plr) {
//       return plr.account.toString() === userId;
//     });
//     const cardDrafted = player.queue[0].find(function (card) {
//       return card._id.toString() === cardId.toString();
//     });
//     const packMinusCardDrafted = player.queue[0].filter(function (card) {
//       return card._id !== cardDrafted._id;
//     });
//     const updatedCardPool = [...player.mainboard, cardDrafted];

//     const passRight = player.packs.length % 2 === 0;
//     const passLeft = player.packs.length % 2 === 1;
//     const playerIndex = event.players.indexOf(player);
//     let otherPlayerIndex;

//     if (playerIndex === event.players.length - 1 && passRight) {
//       otherPlayerIndex = 0;
//     } else if (playerIndex === event.players.length - 1 && passLeft) {
//       otherPlayerIndex = playerIndex - 1;
//     } else if (playerIndex === 0 && passRight) {
//       otherPlayerIndex = 1;
//     } else if (playerIndex === 0 && passLeft) {
//       otherPlayerIndex = event.players.length - 1;
//     } else if (passRight) {
//       otherPlayerIndex = playerIndex + 1;
//     } else {
//       otherPlayerIndex = playerIndex - 1;
//     }
    
//     const otherPlayerUpdatedQueue = packMinusCardDrafted.length > 0 ?
//       [...event.players[otherPlayerIndex].queue, packMinusCardDrafted] :
//       event.players[otherPlayerIndex].queue;
      
//     event.players[otherPlayerIndex].queue = otherPlayerUpdatedQueue;
      
//     const updatedQueue = player.queue.length > 1 ? player.queue.slice(1) : [];

//     event.players[playerIndex].mainboard = updatedCardPool;
//     event.players[playerIndex].queue = updatedQueue;

//     let finished = event.players.every(function (plr) {
//       return plr.packs.length + plr.queue.length === 0;
//     });

//     if (finished) {
//       event.finished = true;
//     }

//     let nextPack = event.players.every(function (plr) {
//       return plr.queue.length === 0 && plr.packs.length > 0;
//     });

//     if (nextPack) {
//       for (let plr of event.players) {
//         plr.queue.push(plr.packs[0]);
//         plr.packs.shift();
//       }
//     }

//     await event.save();

//     for (let plr of event.players) {
//       this.io.to(`${eventId} - ${plr.account.toString()}`).emit('updateEventStatus',
//         {
//           finished: finished,
//           mainboard: plr.mainboard,
//           pack: (plr.queue.length > 0 ? plr.queue[0] : [])
//         }
//       );
//     }
//   } catch (error) {
//     this.io.to(eventId).emit('error', error);
//   }
// };