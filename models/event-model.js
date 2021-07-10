import mongoose from 'mongoose';

import { cubeCardSchema } from './cube-model.js';

const playerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  mainboard: [cubeCardSchema],
  packs: [[cubeCardSchema]],
  queue: [[cubeCardSchema]],
  sideboard: [cubeCardSchema]
}, {
  _id: false
});

const eventSchema = new mongoose.Schema({
  cube: {
    ref: 'Cube',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
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