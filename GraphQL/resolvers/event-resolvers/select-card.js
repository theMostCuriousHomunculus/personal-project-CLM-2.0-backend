import HttpError from '../../../models/http-error.js';
import { Event } from '../../../models/event-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("You must be logged in to select a card.", 401);

  const event = await Event.findById(args.eventID);

  if (!event) throw new HttpError("Could not find an event with the provided ID.", 404);

  const player = event.players.find(plr => plr.account.toString() === context.account._id.toString());

  if (!player) throw new HttpError("You were not invited to this event.", 401);

  const cardDrafted = player.queue[0].find(card => card._id.toString() === args.cardID);

  if (!cardDrafted) throw new HttpError("You attempted to draft an invalid card.", 404);

  player.mainboard = [...player.mainboard, cardDrafted];

  const packMinusCardDrafted = player.queue[0].filter(card => card._id !== cardDrafted._id);
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
  context.pubsub.publish(args.eventID, { event });

  return event;
};