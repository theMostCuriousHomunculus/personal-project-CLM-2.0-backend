import HttpError from '../../../models/http-error.js';

export default async function (parent, args, context, info) {

  const { event } = context;

  if (!event) throw new HttpError("An event with the provided ID does not exist or you were not invited to it.", 404);

  return event;
};