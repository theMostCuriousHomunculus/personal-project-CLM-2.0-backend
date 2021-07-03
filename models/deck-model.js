import mongoose from 'mongoose';

const deckCardSchema = new mongoose.Schema({
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

const deckSchema = new mongoose.Schema({
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
  format: {
    enum: ['Legacy', 'Modern', 'Pauper', 'Pioneer', 'Standard', 'Vintage'],
    required: false,
    type: String
  },
  mainboard: [deckCardSchema],
  name: {
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    },
    required: true,
    trim: true,
    type: String
  },
  sideboard: [deckCardSchema]
});

deckSchema.index({ name: "text", description: "text" });

const Deck = mongoose.model('Deck', deckSchema);

export { Deck as default, deckCardSchema };