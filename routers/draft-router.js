const express = require('express');

const t3 = require('../middleware/tier-3-access');
const { asyncArray } = require('../utils/async-array');
const {
  createDraft,
  fetchDrafts
} = require('../controllers/draft-controller');
const { Account } = require('../models/account-model');
const { Draft } = require('../models/draft-model');

const router = new express.Router();

const routerWithSocketIO = function (io) {

  router.get('/', fetchDrafts);

  router.post('/', t3, createDraft);

  io.on('connect', function (socket) {

    socket.on('join', async function (draftId, userId) {

      const draft = await Draft.findById(draftId);

      if (!userId) {
        socket.emit('bounce', 'You must be logged in to visit draft pages.');
      } else if (!draft) {
        socket.emit('bounce', 'Could not find a draft with that ID.');
      } else if (!draft.drafters.find(function (drafter) {
        return drafter.drafter.toString() === userId.toString();
      })) {
        socket.emit('bounce', 'You were not invited to this draft.');
      } else {

        const drafter = draft.drafters.find(function (drafter) {
          return drafter.drafter.toString() === userId.toString();
        });
        drafter.socketId = socket.id;
        await draft.save();

        socket.join(draftId);

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

        let finished = draft.drafters.every(function (drftr) {
          return drftr.packs.length + drftr.queue.length === 0;
        });

        // the draft host needs a way to download a csv file for each other drafter that contains the picks that drafter made so trades can be made
        let otherDraftersPicks = [];
        if (finished && draft.host.toString() === userId) {
          let otherDrafters = draft.drafters.filter(function (drftr) {
            return drftr.drafter.toString() !== userId;
          });
          for (let drftr of otherDrafters) {
            otherDraftersPicks.push({
              name: displayedDraftersInfo.find(function (x) {
                return x.drafter.toString() === drftr.drafter.toString();
              }).name,
              picks: drftr.picks.map(function (pick) {
                return pick.mtgo_id;
              })
            })
          }
        }

        socket.emit('admittance', 
          finished ?
          {
            drafters: displayedDraftersInfo,
            name: draft.name,
            other_drafters_picks: otherDraftersPicks,
            pack: [],
            picks: drafter.picks
          } :
          {
            drafters: displayedDraftersInfo,
            name: draft.name,
            pack: (drafter.queue.length > 0 ? drafter.queue[0] : [])
          }
        );

      }
  
    });

    socket.on('selectCard', async function (cardId, draftId, userId) {
      const draft = await Draft.findById(draftId);

      const drafter = draft.drafters.find(function (drftr) {
        return drftr.drafter.toString() === userId.toString();
      });

      const cardDrafted = drafter.queue[0].find(function (crd) {
        return crd._id.toString() === cardId.toString();
      });

      drafter.queue[0].pull(cardDrafted);
      drafter.picks.push(cardDrafted);
      await draft.save();
      
      if (drafter.queue[0].length > 0) {
        if (draft.drafters.indexOf(drafter) === draft.drafters.length - 1) {
          draft.drafters[0].queue.push(drafter.queue[0]);
        } else {
          draft.drafters[draft.drafters.indexOf(drafter) + 1].queue.push(drafter.queue[0]);
        }
      }
      drafter.queue.shift();
      await draft.save();

      let finished = draft.drafters.every(function (drftr) {
        return drftr.packs.length + drftr.queue.length === 0;
      });

      let nextPack = draft.drafters.every(function (drftr) {
        return drftr.queue.length === 0 && drftr.packs.length > 0;
      });

      if (nextPack) {
        for (drftr of draft.drafters) {
          drftr.queue.push(drftr.packs[0]);
          drftr.packs.shift();
        }
        await draft.save();
      }

      for (drftr of draft.drafters) {
        io.to(drftr.socketId).emit('updateDraftStatus',
          finished ?
          { pack: [], picks: drftr.picks } :
          { pack: (drftr.queue.length > 0 ? drftr.queue[0] : []) }
        );
      }

    });

    socket.on('leave', async function (draftId, userId) {
      const draft = await Draft.findById(draftId);
      draft.drafters.find(function (drafter) {
        return drafter.drafter.toString() === userId.toString();
      }).socketId = undefined;
      await draft.save();
    });

  });

  return router;
}

module.exports = routerWithSocketIO;