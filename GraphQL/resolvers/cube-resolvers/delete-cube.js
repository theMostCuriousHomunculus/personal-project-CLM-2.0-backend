import Cube from '../../../models/cube-model.js';

export default async function (parent, args, context, info) {
  const cube = await Cube.findById(args.cubeID);

  if (context.account._id.toString() === cube.creator.toString()) {
    await cube.delete();

    return true;
  } else {
    throw new HttpError("You are not authorized to delete this cube.", 401);
  }

};