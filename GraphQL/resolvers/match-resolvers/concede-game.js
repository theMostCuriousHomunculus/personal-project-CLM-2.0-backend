import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  // currently only supporting 2 player games
  match.game_winners.push(match.players.find(plr => plr.account.toString() !== account._id.toString()).account);
  match.log.push(`${account.name} has conceded from the game.`)

  function resetCard (card) {
    if (!card.isCopyToken) {
      card.controller = card.owner;
      card.counters = [];
      card.face_down = false;
      card.face_down_image = 'standard';
      card.flipped = false;
      card.library_position = null;
      card.tapped = false;
      card.targets = [];
      card.visibility = [card.owner];
      card.x_coordinate = 0;
      card.y_coordinate = 0;
      card.z_index = 0;

      if (card.sideboarded) {
        match.players.find(p => p.account.toString() === card.owner.toString()).sideboard.push(card);
      } else {
        match.players.find(p => p.account.toString() === card.owner.toString()).mainboard.push(card);
      }

    }
  } 

  for (const plr of match.players) {
    plr.energy = 0;
    plr.life = 20;
    plr.poison = 0;
    
    for (const zone of ['battlefield', 'exile', 'graveyard', 'hand', 'library', 'temporary']) {
      for (const card of plr[zone]) {
        resetCard(card);
      }
      plr[zone] = [];
    }
  }

  for (const card of match.stack) {
    resetCard(card);
  }

  await match.save();
  pubsub.publish(match._id.toString(), { subscribeMatch: match });

  return match;
};