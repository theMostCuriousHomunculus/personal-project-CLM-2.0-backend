import mongoose from 'mongoose';

const cubeCardSchema = new mongoose.Schema({
  back_image: String,
  cmc: {
    required: true,
    type: Number
  },
  collector_number: {
    required: true,
    type: Number
  },
  color_identity: [String],
  image: {
    required: true,
    type: String
  },
  keywords: [String],
  mana_cost: String,
  mtgo_id: Number,
  name: {
    required: true,
    type: String
  },
  oracle_id: {
    required: true,
    type: String
  },
  scryfall_id: {
    required: true,
    type: String
  },
  set: {
    required: true,
    type: String
  },
  set_name: {
    require: true,
    type: String
  },
  tcgplayer_id: Number,
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
  type_line: {
    required: true,
    type: String
  }
});

const moduleSchema = new mongoose.Schema({
  cards: [cubeCardSchema],
  name: {
    maxlength: 30,
    required: true,
    trim: true,
    type: String
  }
});

const rotationSchema = new mongoose.Schema({
  cards: [cubeCardSchema],
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
  mainboard: [cubeCardSchema],
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
  sideboard: [cubeCardSchema]
});

cubeSchema.index({ name: "text", description: "text" });

const Cube = mongoose.model('Cube', cubeSchema);

export { Cube as default, cubeCardSchema };