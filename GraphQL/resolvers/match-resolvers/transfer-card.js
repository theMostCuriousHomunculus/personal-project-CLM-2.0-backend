import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { cardID, destinationZone, index, originZone, reveal, shuffle } } = args;
  let card;

  if (originZone.toString() === 'stack') {
    card = match.stack.find(crd => crd._id.toString() === cardID);
    match.stack = match.stack.filter(crd => crd !== card);
  } else {
    card = player[originZone].find(crd => crd._id.toString() === cardID);
    player[originZone] = player[originZone].filter(crd => crd !== card);
  }

  match.log.push(`${account.name} moved ${match.players.every(plr => card.visibility.includes(plr.account)) ? card.name : 'a card'} from ${originZone.toString() === 'stack' ? 'the stack' : 'their '+ originZone} to ${destinationZone.toString() === 'stack' ? 'the stack' : 'their ' + destinationZone}.`);

  if (originZone.toString() === 'library') card.face_down = true;

  if (reveal) {
    for (const plr of match.players) {
      if (!card.visibility.includes(plr.account)) card.visibility.push(plr.account);
    }
  }

  // note that this resolver does not actually shuffle the library.  it is up to the player to send a separate request to shuffle the library.
  if (destinationZone.toString() === "library" && !shuffle) {
    // think scrying or aethergust
    player.library = player.library.slice(0, index).concat([card]).concat(player.library.slice(index));
  } else if (destinationZone.toString() === "library" && shuffle && typeof index === "number") {
    // think vampiric tutor
    card.index = index;
    player.temporary.push(card);
  } else if (destinationZone.toString() === "stack") {
    match.stack.push(card);
  } else {
    // if destination is library, a shuffle is needed but no index is provided OR if the destination is not the library OR the stack then the card can just be pushed into the destination zone
    if (destinationZone.toString() === 'hand' && !card.visibility.includes(account._id)) card.visibility.push(account._id);
    
    player[destinationZone].push(card);
  }

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};