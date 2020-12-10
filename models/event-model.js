import mongoose from 'mongoose';

import { cardSchema } from './cube-model.js';

const playerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  chaff: [cardSchema],
  mainboard: [cardSchema],
  packs: [[cardSchema]],
  queue: [[cardSchema]],
  sideboard: [cardSchema]
}, {
  _id: false
});

const eventSchema = new mongoose.Schema({
  finished: {
    default: false,
    required: true,
    type: Boolean
  },
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

export { Event };