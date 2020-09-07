const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  body: {
    required: true,
    type: String
  }
}, {
  timestamps: true
});

const blogSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  body: {
    required: true,
    type: String
  },
  comments: [commentSchema],
  image: {
    required: true,
    type: String
  },
  subtitle: {
    maxlength: 100,
    trim: true,
    type: String
  },
  title: {
    maxlength: 100,
    required: true,
    trim: true,
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

commentSchema.virtual('author', {
  foreignField: '_id',
  justOne: true,
  localField: 'authorId',
  ref: 'Account'
});

blogSchema.virtual('author', {
  foreignField: '_id',
  justOne: true,
  localField: 'authorId',
  ref: 'Account'
});

blogSchema.index({ title: "text", subtitle: "text" });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {
  Blog
};