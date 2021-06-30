import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  back_image: {
    required: false,
    type: String
  },
  cmc: {
    required: true,
    type: Number
  },
  controller: {
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  // TODO: this is initializing every card with an array of length 1 that contains an object with only an _id
  counters: [{
    counterAmount: Number,
    counterType: String
  }],
  face_down: {
    default: false,
    type: Boolean
  },
  face_down_image: {
    default: 'standard',
    enum: ['foretell', 'manifest', 'morph', 'standard'],
    required: true,
    type: String
  },
  flipped: {
    default: false,
    type: Boolean
  },
  image: {
    required: true,
    type: String
  },
  index: {
    required: false,
    type: Number
  },
  isCopyToken: {
    required: true,
    type: Boolean
  },
  name: {
    required: true,
    type: String
  },
  owner: {
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  sideboarded: {
    default: false,
    required: true,
    type: Boolean
  },
  tapped: {
    default: false,
    required: true,
    type: Boolean
  },
  targets: [{
    ref: 'Card',
    type: mongoose.Schema.Types.ObjectId
  }],
  tokens: [{
    name: {
      required: true,
      type: String
    },
    scryfall_id: {
      required: true,
      type: String
    }
  }],
  visibility: [{
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }],
  x_coordinate: {
    default: 0,
    required: true,
    type: Number,
    validate: [coordinateBoundaries, `{PATH} must be in the interval [0, 100).`]
  },
  y_coordinate: {
    default: 0,
    required: true,
    type: Number,
    validate: [coordinateBoundaries, `{PATH} must be in the interval [0, 100).`]
  },
  z_index: {
    default: 0,
    required: true,
    type: Number
  }
});

function coordinateBoundaries(value) {
  return value >= 0 && value < 100;
}

const playerSchema = new mongoose.Schema({
  account: {
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  battlefield: [cardSchema],
  energy: {
    default: 0,
    required: false,
    type: Number
  },
  exile: [cardSchema],
  graveyard: [cardSchema],
  hand: [cardSchema],
  library: [cardSchema],
  life: {
    default: 20,
    required: true,
    type: Number
  },
  mainboard: [cardSchema],
  poison: {
    default: 0,
    required: false,
    type: Number
  },
  sideboard: [cardSchema],
  temporary: [cardSchema]
}, {
  _id: false
});

const matchSchema = new mongoose.Schema({
  cube: {
    ref: 'Cube',
    required: false,
    type: mongoose.Schema.Types.ObjectId
  },
  event: {
    ref: 'Event',
    required: false,
    type: mongoose.Schema.Types.ObjectId
  },
  game_winners: [{
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }],
  log: [String],
  players: [playerSchema],
  stack: [cardSchema]
});

const Match = mongoose.model('Match', matchSchema);

export { Match };