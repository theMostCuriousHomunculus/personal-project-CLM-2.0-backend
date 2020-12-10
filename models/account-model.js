import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  admin: {
    default: false,
    type: Boolean
  },
  avatar: {
    type: String
  },
  buds: [{
    ref: 'Account',
    type: mongoose.Schema.Types.ObjectId
  }],
  email: {
    lowercase: true,
    required: true,
    trim: true,
    type: String,
    unique: true
  },
  name: {
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    },
    maxlength: 30,
    required: true,
    trim: true,
    type: String        
  },
  password: {
    minlength: 7,
    required: true,
    trim: true,
    type: String
  },
  received_bud_requests: [{
    ref: 'Account',
    type: mongoose.Schema.Types.ObjectId
  }],
  sent_bud_requests: [{
    ref: 'Account',
    type: mongoose.Schema.Types.ObjectId
  }],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

accountSchema.methods.generateAuthenticationToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

accountSchema.statics.findByCredentials = async (email, enteredPassword) => {
  const user = await Account.findOne({ email })

  if (!user) {
    throw new Error('The provided email address and/or password were incorrect.  Please try again.');
  }

  const isMatch = await bcrypt.compare(enteredPassword, user.password);

  if (!isMatch) {
    throw new Error('The provided email address and/or password were incorrect.  Please try again.');
  }

  return user;
};

// allows searching for other users by name for bud request purposes
accountSchema.index({ name: "text" });

// Hash the plain text password before saving
accountSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const Account = mongoose.model('Account', accountSchema);

export { Account };