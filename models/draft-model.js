const mongoose = require('mongoose');
const { cardSchema } = require('./cube-model');

const drafterSchema = new mongoose.Schema({
  drafter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  queue: [[cardSchema]],
  packs: [[cardSchema]],
  picks: [cardSchema]
});

const draftSchema = new mongoose.Schema({
  name: {
    required: true,
    trim: true,
    type: String    
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  drafters: [drafterSchema]
});

const Draft = mongoose.model('Draft', draftSchema);

module.exports = {
  Draft
}