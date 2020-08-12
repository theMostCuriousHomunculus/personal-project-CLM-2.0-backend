const mongoose = require('mongoose');
const { cardSchema } = require('./cube-model');

const playerSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  queue: [[cardSchema]],
  packs: [[cardSchema]],
  card_pool: [cardSchema],
  socketId: String
});

const eventSchema = new mongoose.Schema({
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
  players: [playerSchema]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
  Event
}