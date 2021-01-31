import mongoose from 'mongoose';

import Cube from '../models/cube-model.js';
import HttpError from '../models/http-error.js';

interface CardInterface extends mongoose.Document {
  back_image?: String,
  cmc: Number,
  color_identity: [String],
  image: String,
  keywords: [String],
  loyalty?: Number,
  mana_cost: String,
  mtgo_id?: Number,
  name: String,
  oracle_id: String,
  power?: Number,
  printing: String,
  purchase_link: String,
  toughness?: Number,
  type_line: String
}
// interface ModuleInterface extends mongoose.Document {
//   cards: [CardInterface],
//   name: String
// }
// interface RotationInterface extends mongoose.Document {
//   cards: [CardInterface],
//   name: String,
//   size: Number
// }
// interface CubeInterface extends mongoose.Document {
//   creator: mongoose.Schema.Types.ObjectId,
//   description: String,
//   mainboard: [CardInterface],
//   modules: [ModuleInterface],
//   name: String,
//   rotations: [RotationInterface],
//   sideboard: [CardInterface]
// }
type MongodbID = mongoose.Types.ObjectId | string;

export default async function (cubeID: MongodbID, componentID: MongodbID) {
  const cube = await Cube.findById(cubeID);

  if (!cube) throw new HttpError('Could not find a cube with the provided ID.', 404);

  let component: Array<CardInterface>;

  if (componentID === 'mainboard') {
    component = cube.get('mainboard');
  } else if (componentID === 'sideboard') {
    component = cube.get('sideboard');
  } else if (cube.get('modules').id(componentID)) {
    component = cube.get('modules').id(componentID).get('cards');
  } else if (cube.get('rotations').id(componentID)) {
    component = cube.get('rotations').id(componentID).get('cards');
  } else {
    throw new HttpError('Invalid component ID provided.', 400);
  }
  
  return component;
}