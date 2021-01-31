import HttpError from '../models/http-error.js';

export default async function (cube, componentID) {

  let component;

  if (componentID === 'mainboard') {
    component = cube.mainboard;
  } else if (componentID === 'sideboard') {
    component = cube.sideboard;
  } else if (cube.modules.id(componentID)) {
    component = cube.modules.id(componentID).cards;
  } else if (cube.rotations.id(componentID)) {
    component = cube.rotations.id(componentID).cards;
  } else {
    throw new HttpError('Invalid component ID provided.', 400);
  }
  
  return component;
}