import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { event, player, pubsub } = context;
  const { _id } = args;

  if (!event) throw new HttpError("An event with the provided ID does not exist or you were not invited to it.", 404);

  const cardDrafted = player.queue[0].find(card => card._id.toString() === _id);

  if (!cardDrafted) throw new HttpError("You attempted to draft an invalid card.", 404);

  player.mainboard = [...player.mainboard, cardDrafted];

  const packMinusCardDrafted = player.queue[0].filter(card => card._id.toString() !== _id);
  const passRight = player.packs.length % 2 === 0;
  const passLeft = player.packs.length % 2 === 1;
  const playerIndex = event.players.indexOf(player);
  let otherPlayerIndex;

  if (playerIndex === event.players.length - 1 && passRight) {
    otherPlayerIndex = 0;
  } else if (playerIndex === 0 && passLeft) {
    otherPlayerIndex = event.players.length - 1;
  } else if (passRight) {
    otherPlayerIndex = playerIndex + 1;
  } else {
    otherPlayerIndex = playerIndex - 1;
  }
  
  event.players[otherPlayerIndex].queue = packMinusCardDrafted.length > 0 ?
    [...event.players[otherPlayerIndex].queue, packMinusCardDrafted] :
    event.players[otherPlayerIndex].queue;

  player.queue = player.queue.slice(1);

  event.finished = event.players.every(plr => plr.packs.length + plr.queue.length === 0);

  const nextPack = event.players.every(plr => plr.queue.length === 0 && plr.packs.length > 0);

  if (nextPack) {
    for (let plr of event.players) {
      plr.queue.push(plr.packs[0]);
      plr.packs.shift();
    }
  }

  await event.save();
  pubsub.publish(event._id.toString(), { joinEvent: event });

  return event;
};