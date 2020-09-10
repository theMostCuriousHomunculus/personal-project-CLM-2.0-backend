// tier 2 access should block users from editing or deleting content that they did not create nor have been named a collaborator on by the creator of a resource

const jwt = require('jsonwebtoken');

const { Account } = require('../models/account-model');
const { Cube } = require('../models/cube-model');
const { Blog } = require('../models/blog-model');

const t2 = async function (req, res, next) {

    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
      // const token = req.cookies['authentication_token'];
      const token = req.header('Authorization').replace('Bearer ', '');

      if (!token) {
          throw new Error('You must be logged in to perform this action.');
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Account.findOne({ _id: decodedToken._id, 'tokens.token': token });
      if (!user) {
          throw new Error('You are do not have permission to perform the requested action.');
      } else {
          req.user = user;
      }

      if (req.params.cubeId) {
        const cube = await Cube.findById(req.params.cubeId);
        if (user._id.equals(cube.creatorId)) {
          req.cube = cube;
        } else {
          throw new Error('You are do not have permission to perform the requested action.');
        }
      }

      if (req.params.blogPostId) {
        const blogPost = await Blog.findById(req.params.blogPostId);
        if (user._id.equals(blogPost.authorId)) {
          req.blogPost = blogPost;
        } else {
          throw new Error('You are do not have permission to perform the requested action.');
        }
      }

      next();

    } catch (error) {
        res.status(401).json({ message: error.message });
    }

};

module.exports = t2;