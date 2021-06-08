import axios from 'axios';

import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { account, match, player, pubsub } = context;

  if (!player) throw new HttpError("You are only a spectator.", 401);

  const { input: { numberOfTokens, scryfallID } } = args;
  const scryfallResponse = await axios.get(`https://api.scryfall.com/cards/${scryfallID}`);

  for (const i = 0; i < numberOfTokens; i++) {
    player.battlefield.push({
      controller: account._id,
      image: scryfallResponse.data.image_uris.normal,
      isToken: true,
      name: scryfallResponse.data.name,
      owner: account._id,
      tokens: scryfallResponse.data.all_parts
        .filter(part => part.component === 'token')
        .map(part => ({ name: part.name, scryfall_id: part.id })),
      visibility: match.players.map(plr => plr.account),
      x_coordinate: i,
      y_coordinate: i
    });
  }

  await match.save();
  pubsub.publish(match._id.toString(), { joinMatch: match });

  return match;
};