// tier 2 access should block users from editing or deleting content that they did not create nor have been named a collaborator on by the creator of a resource

import jwt from 'jsonwebtoken';

import Account from '../models/account-model.js';
import Blog from '../models/blog-model.js';
import Cube from '../models/cube-model.js';
import HttpError from '../models/http-error.js';

export default async function (req, res, next) {

  if (req.method === 'OPTIONS') {
      return next();
  }

  try {
    // const token = req.cookies['authentication_token'];
    let token = req.header('Authorization');

    if (!token) {
      throw new HttpError('You must be logged in as the correct user to perform this action.', 401);
    } else {
      token = token.replace('Bearer ', '')
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new HttpError('You must be logged in as the correct user to perform this action.', 401);
    }

    const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });

    if (!user) {
      throw new HttpError('You must be logged in as the correct user to perform this action.', 401);
    } else {
      req.user = user;
    }

    if (req.params.cubeId) {
      const cube = await Cube.findById(req.params.cubeId).populate({ path: 'creator', select: 'creator' });

      if (user._id.equals(cube.creator._id)) {
        req.cube = cube;
      } else {
        throw new HttpError('You do not have permission to perform the requested action.', 401);
      }
    }

    if (req.params.blogPostId) {
      const blogPost = await Blog.findById(req.params.blogPostId);

      if (user._id.equals(blogPost.author)) {
        req.blogPost = blogPost;
      } else {
        throw new HttpError('You do not have permission to perform the requested action.', 401);
      }
    }

    next();

  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};