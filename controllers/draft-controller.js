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
      drafters[i].queue.push(cardpool.splice(0, cardsPerPack));
      for (let j = 1; j < packsPerDrafter; j++) {
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

async function fetchDrafts (req, res) {
  try{
    const drafter = req.query.drafter;
    const drafts = await Draft.find({ "drafters.drafter": drafter }).select('createdAt host name');

    // populate the hosts with their names and avatars
    await asyncArray(drafts, async function (draft) {
      const user = await Account.findById(draft.host);
      draft.host_name = user.name;
      draft.host_avatar = user.avatar;
    });

    const draftsWithHostInfo = drafts.map(function (draft) {
      return {
        createdAt: draft.createdAt,
        host: {
          avatar: draft.host_avatar,
          _id: draft.host,
          name: draft.host_name
        },
        _id: draft._id,
        name: draft.name
      };
    });

    res.status(200).json({ drafts: draftsWithHostInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDraft,
  fetchDrafts
}