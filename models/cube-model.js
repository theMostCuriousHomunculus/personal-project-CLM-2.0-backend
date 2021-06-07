import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  back_image: {
    type: String
  },
  chapters: {
    type: Number
  },
  cmc: {
    required: true,
    type: Number
  },
  color_identity: [{
    required: true,
    type: String
  }],
  image: {
    required: true,
    type: String
  },
  keywords: [{
    type: String
  }],
  loyalty: {
    type: Number
  },
  mana_cost: {
    type: String
  },
  mtgo_id: {
    type: Number
  },
  name: {
    required: true,
    type: String
  },
  oracle_id: {
    required: true,
    type: String
  },
  power: {
    type: Number
  },
  printing: {
    required: true,
    type: String
  },
  purchase_link: {
    type: String
  },
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
  toughness: {
    type: Number
  },
  type_line: {
    type: String
  }
});

const moduleSchema = new mongoose.Schema({
  cards: [cardSchema],
  name: {
    maxlength: 30,
    required: true,
    trim: true,
    type: String
  }
});

const rotationSchema = new mongoose.Schema({
  cards: [cardSchema],
  name: {
    maxlength: 30,
    required: true,
    trim: true,
    type: String
  },
  size: {
    type: Number,
    required: true
  }
});

const cubeSchema = new mongoose.Schema({
  creator: {
    ref: 'Account',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    default: '',
    index: {
      collation: { locale: 'en', strength: 2 }
    },
    type: String
  },
  mainboard: [cardSchema],
  modules: [moduleSchema],
  name: {
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    },
    maxlength: 30,
    required: true,
    trim: true,
    type: String
  },
  rotations: [rotationSchema],
  sideboard: [cardSchema]
});

// allows searching for other users by name for bud request purposes
cubeSchema.index({ name: "text", description: "text" });

const Cube = mongoose.model('Cube', cubeSchema);

export { Cube as default, cardSchema };