const { Account } = require('../models/account-model');
const { Cube } = require('../models/cube-model');
const { Draft } = require('../models/draft-model');

const { asyncArray } = require('../utils/async-array');
const { randomSampleWithoutReplacement } = require('../utils/random-sample-wo-replacement');
const { shuffle } = require('../utils/shuffle');

async function createDraft (req, res) {
  try {
    const cube = await Cube.findById(req.body.cube);
    const cardsPerPack = req.body.cards_per_pack;
    const packsPerDrafter = req.body.packs_per_drafter;
    let cardpool = cube.mainboard;

    cube.modules.forEach(function (module) {
      if (req.body['modules[]'] && req.body['modules[]'].includes(module._id.toString())) {
        cardpool = cardpool.concat(module.cards);
      }
    });

    cube.rotations.forEach(function (rotation) {
      cardpool = cardpool.concat(randomSampleWithoutReplacement(rotation.cards, rotation.size));
    });

    shuffle(cardpool);

    // creating an initial drafters array that only contains one drafter (the user who is creating the draft)
    let drafters = [{ drafter: req.user._id, queue: [], packs: [], picks: [] }];

    if (req.body['other_drafters[]']) {
      req.body['other_drafters[]'].forEach(function (other_drafter) {
        drafters.push({ drafter: other_drafter, queue: [], packs: [], picks: [] });
      });
    }
  
    shuffle(drafters);
  
    // dish out packs to drafters
    for (let i = 0; i < drafters.length; i++) {
      for (let j = 0; j < packsPerDrafter; j++) {
        drafters[i].packs.push(cardpool.splice(0, cardsPerPack));
      }
    }

    const draft = new Draft({
      name: req.body.name,
      host: req.user._id,
      drafters
    });

    await draft.save();
    res.status(201).json({ _id: draft._id });
  } catch (error) {
    res.status(500).json({ message : error.message });
  }
};

async function fetchDraft (req, res) {
  try{
    const draft = await Draft.findById(req.params.draftId);

    if (!draft) {
      return res.status(404).json({ message: 'Could not find a draft with that ID.'});
    }

    if (!draft.drafters.find(function (drafter) {
      return drafter.drafter.toString() === req.user._id.toString();
    })) {
      return res.status(401).json({ message: 'You were not invited to this draft.' });
    }

    const drafterIndex = draft.drafters.findIndex(function (drafter) {
      return drafter.drafter.toString() === req.user._id.toString();
    });

    // populate the drafters with their names and avatars
    await asyncArray(draft.drafters, async function (drafter) {
      const user = await Account.findById(drafter.drafter);
      drafter.name = user.name;
      drafter.avatar = user.avatar;
    });

    const displayedDraftersInfo = draft.drafters.map(function (drafter) {
      return {
        avatar: drafter.avatar,
        drafter: drafter.drafter,
        name: drafter.name
      };
    });

    // check to see if the lobby is ready for the next pack or if at least one drafter still needs to make a pick
    let nextPack = 1;

    for (let i = 0; i < draft.drafters.length; i++) {
      if (draft.drafters[i].queue.length === 0 || draft.drafters[i].queue[0].length === 0) {
        nextPack = 1;
      } else {
        nextPack = 0;
      }
    }

    if (nextPack === 1 && draft.drafters[drafterIndex].packs.length === 0) {
      // the drafter has made all of his picks and can now begin to build his or her deck
      res.status(200).json({
        drafters: displayedDraftersInfo,
        lobby_name: draft.name,
        picks: draft.drafters[drafterIndex].picks
      });
    } else if (nextPack === 1) {
      // ready to start a new round of packs
      for (let i = 0; i < draft.drafters.length; i++) {
        draft.drafters[i].queue.shift();
        draft.drafters[i].queue.push(draft.drafters[i].packs[0]);
        draft.drafters[i].packs.shift();
      }
      await draft.save();
      res.status(200).json({
        drafters: displayedDraftersInfo,
        lobby_name: draft.name,
        pack: draft.drafters[drafterIndex].queue[0]
      });
    } else if (nextPack === 0 && draft.drafters[drafterIndex].queue.length === 0) {
      // the drafter who passes their pack to this drafter has not made a pick yet
      res.status(200).json({
        drafters: displayedDraftersInfo,
        lobby_name: draft.name
      });
    } else {
      // there is a pack in the drafter's queue that they can go ahead and make a pick from
      res.status(200).json({
        drafters: displayedDraftersInfo,
        lobby_name: draft.name,
        pack: draft.drafters[drafterIndex].queue[0]
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDraft,
  fetchDraft
}