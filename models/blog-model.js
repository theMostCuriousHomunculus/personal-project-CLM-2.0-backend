import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  body: {
    required: true,
    type: String
  },
  comments: [commentSchema],
  createdAt: Date,
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
  },
  updatedAt: Date
});

blogSchema.index({ title: "text", subtitle: "text" });

const Blog = mongoose.model('Blog', blogSchema);

const Comment = mongoose.model('Comment', commentSchema);

export { Blog as default, Comment };