import axios from 'axios';
import CSVString from 'csv-string';

import Cube from '../../../models/cube-model.js';
import formatScryfallCardData from '../../../utils/format-scryfall-card-data.js';

export default async function (req, res) {
  try {
    const cardArray = [];

    if (req.body.cobraId) {
      const cubeCobraResponse = await axios.get(`https://cubecobra.com/cube/download/csv/${req.body.cobraId}`);

      CSVString.forEach(cubeCobraResponse.data, ',', function (card, index) {
        if (index > 0 && card[4] && card[5]) {
          cardArray.push({
            set: card[4],
            collector_number: card[5]
          });
        }
      });
  
      // according to scryfall api documentation, "A maximum of 75 card references may be submitted per request."
      const numberOfScryfallRequests = Math.ceil(cardArray.length / 75);
      const scryfallRequestArrays = [];
  
      for (let requestNumber = 1; requestNumber <= numberOfScryfallRequests; requestNumber++) {
        scryfallRequestArrays.push(cardArray.splice(0, 75));
      }
      
      let scryfallResponse;
  
      for (let request of scryfallRequestArrays) {
        scryfallResponse = await axios.post('https://api.scryfall.com/cards/collection', {
          identifiers: request
        });
  
        for (let card of scryfallResponse.data.data) {
          cardArray.push(formatScryfallCardData(card));
        }
      }
    }

    const cube = new Cube({
      creator: req.user._id,
      description: req.body.description,
      mainboard: await Promise.all(cardArray),
      name: req.body.name
    });
  
    await cube.save();
    res.status(201).json({ _id: cube._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};