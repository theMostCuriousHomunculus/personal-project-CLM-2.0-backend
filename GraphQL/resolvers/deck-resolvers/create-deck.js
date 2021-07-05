import axios from 'axios';
import CSVString from 'csv-string';

import Deck from '../../../models/deck-model.js';
import HttpError from '../../../models/http-error.js';
import formatScryfallCardData from '../../../utils/format-scryfall-card-data.js';
// TODO: import deck list from scryfall, tappedout or mtggoldfish

export default async function (parent, args, context, info) {

  if (!context.account) throw new HttpError("You must be logged in to create a deck.", 401);

  const { input: { description, existingListID, format, name } } = args;
  const deckInfo = {
    creator: context.account._id,
    description,
    mainboard: [],
    name,
    sideboard: []
  };
  const copiesArray = [];
  const identifierArray = [];

  if (existingListID) {
    const listResponse = await axios.get(`https://api.scryfall.com/decks/${existingListID}/export/csv`);
    CSVString.forEach(listResponse.data, ',', function (card, index) {
      if (index > 0 && card[0] && card[1] && card[16]) {
        copiesArray.push({ component: card[0], copies: parseInt(card[1]), scryfall_id: card[16] });
        identifierArray.push({ id: card[16] });
      }
    });

    // according to scryfall api documentation, "A maximum of 75 card references may be submitted per request."
    const numberOfScryfallRequests = Math.ceil(identifierArray.length / 75);
    const scryfallRequestArrays = [];

    for (let requestNumber = 1; requestNumber <= numberOfScryfallRequests; requestNumber++) {
      scryfallRequestArrays.push(identifierArray.splice(0, 75));
    }

    for (let request of scryfallRequestArrays) {
      const scryfallResponse = await axios.post('https://api.scryfall.com/cards/collection', {
        identifiers: request
      });

      for (let data of scryfallResponse.data.data) {
        data = await formatScryfallCardData(data);
        const allCopyIndexes = copiesArray.reduce((accumulator, current, index) => {
          if (current.scryfall_id === data.scryfall_id) accumulator.push(index);
          return accumulator;
        }, []);

        for (const copyIndex of allCopyIndexes) {
          copiesArray[copyIndex] = {
            ...copiesArray[copyIndex],
            ...data
          };
        }
      }
    }

    for (const card of copiesArray) {
      const component = card.component === 'mainboard' ? 'mainboard' : 'sideboard';
      for (let i = 0; i < card.copies; i++) {
        deckInfo[component].push({
          back_image: card.back_image,
          cmc: card.cmc,
          collector_number: card.collector_number,
          color_identity: card.color_identity,
          image: card.image,
          keywords: card.keywords,
          mana_cost: card.mana_cost,
          mtgo_id: card.mtgo_id,
          name: card.name,
          oracle_id: card.oracle_id,
          scryfall_id: card.scryfall_id,
          set: card.set,
          set_name: card.set_name,
          tcgplayer_id: card.tcgplayer_id,
          tokens: card.tokens,
          type_line: card.type_line
        });
      }
    }
  }

  if (format)  deckInfo.format = format.toString();

  const deck = new Deck(deckInfo);
  await deck.save();
  
  return deck;
};