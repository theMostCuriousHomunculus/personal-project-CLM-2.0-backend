import axios from 'axios';

import HttpError from '../../../models/http-error.js';
import { Match } from '../../../models/match-model.js';

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("Please log in.", 401);

  const { input: { matchID, numberOfTokens, playerID, scryfallID } } = args;

  const match = await Match.findOne({ '_id': matchID, players: { $elemMatch: { account: playerID } } });

  if (!match) throw new HttpError("Could not find a match with the provided matchID and the provided playerID.", 404);

  const player = match.players.find(plr => plr.account.toString() === playerID);
  
  const scryfallResponse = await axios.get(`https://api.scryfall.com/cards/${scryfallID}`);

  for (const i = 0; i < numberOfTokens; i++) {
    player.battlefield.push({
      controller: player.account,
      image: scryfallResponse.data.image_uris.normal,
      isToken: true,
      name: scryfallResponse.data.name,
      owner: player.account,
      tokens: scryfallResponse.data.all_parts
        .filter(part => part.component === 'token')
        .map(part => ({ name: part.name, scryfall_id: part.id })),
      visibility: match.players.map(plr => plr.account),
      x_coordinate: i,
      y_coordinate: i
    });
  }

  await match.save();
  context.pubsub.publish(matchID, { joinMatch: match });

  return match;
};