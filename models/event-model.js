const mongoose = require('mongoose');
const { cardSchema } = require('./cube-model');

const playerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  card_pool: [cardSchema],
  packs: [[cardSchema]],
  queue: [[cardSchema]],
  socketId: String
}, {
  _id: false
});

const eventSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  name: {
    required: true,
    trim: true,
    type: String    
  },
  players: [playerSchema]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
  Event
}