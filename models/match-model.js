import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  counterAmount: {
    required: true,
    type: Number
  },
  counterType: {
    required: true,
    type: String
  }
}, {
  _id: false
});

const matchCardSchema = new mongoose.Schema({
  back_image: {
    required: false,
    type: String
  },
  cmc: Number,
  controller: {
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  counters: [counterSchema],
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
  mana_cost: String,
  name: {
    required: true,
    type: String
  },
  owner: {
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  scryfall_id: {
    required: true,
    type: String
  },
  set: String,
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
  type_line: String,
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
  battlefield: [matchCardSchema],
  energy: {
    default: 0,
    required: false,
    type: Number
  },
  exile: [matchCardSchema],
  graveyard: [matchCardSchema],
  hand: [matchCardSchema],
  library: [matchCardSchema],
  life: {
    default: 20,
    required: true,
    type: Number
  },
  mainboard: [matchCardSchema],
  poison: {
    default: 0,
    required: false,
    type: Number
  },
  sideboard: [matchCardSchema],
  temporary: [matchCardSchema]
}, {
  _id: false
});

const matchSchema = new mongoose.Schema({
  cube: {
    ref: 'Cube',
    required: false,
    type: mongoose.Schema.Types.ObjectId
  },
  decks: [{
    ref: 'Deck',
    required: false,
    type: mongoose.Schema.Types.ObjectId
  }],
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
  stack: [matchCardSchema]
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);

export { Match as default, matchCardSchema };