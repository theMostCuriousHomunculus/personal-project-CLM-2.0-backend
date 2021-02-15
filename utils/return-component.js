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
    throw new HttpError('Could not find a component with the provided ID in the provided cube.', 404);
  }
  
  return component;
}