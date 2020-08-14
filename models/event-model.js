const mongoose = require('mongoose');
const { cardSchema } = require('./cube-model');

const playerSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  queue: [[cardSchema]],
  packs: [[cardSchema]],
  card_pool: [cardSchema],
  socketId: String
}, {
  _id: false
});

const eventSchema = new mongoose.Schema({
  name: {
    required: true,
    trim: true,
    type: String    
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  players: [playerSchema]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
  Event
}