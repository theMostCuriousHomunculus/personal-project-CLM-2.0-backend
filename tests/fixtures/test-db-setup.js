import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Account from '../../models/account-model.js';
import Blog from '../../models/blog-model.js';
import Cube from '../../models/cube-model.js';

const existingUser1ID = new mongoose.Types.ObjectId();
export const existingUser1 = {
  _id: existingUser1ID,
  admin: true,
  avatar: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/3/b/3bd78731-949c-464a-826a-92f86d784911.jpg?1562553791',
  email: 'carnage_tyrant@yahoo.com',
  name: 'Carny-T',
  password: '!Gr0wLR04r',
  tokens: [{
    token: jwt.sign({ _id: existingUser1ID }, process.env.JWT_SECRET)
  }]
};

export const existingCube1 = {
  _id: new mongoose.Types.ObjectId(),
  creator: existingUser1ID,
  mainboard: [],
  description: "It's so baller you won't believe it",
  modules: [],
  name: 'Baller Cube',
  rotations: [],
  sideboard: []
};

const existingUser2ID = new mongoose.Types.ObjectId();
export const existingUser2 = {
  _id: existingUser2ID,
  avatar: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/3/b/3bd78731-949c-464a-826a-92f86d784911.jpg?1562553791',
  email: 'primeval_titan@aol.com',
  name: 'Prime Time',
  password: '123password!@#',
  tokens: [{
    token: jwt.sign({ _id: existingUser2ID }, process.env.JWT_SECRET)
  }]
};

const dateTime = new Date();
const dateTimePlus1 = new Date(dateTime.valueOf() + 1000);
const dateTimePlus2 = new Date(dateTime.valueOf() + 2000);
const dateTimePlus3 = new Date(dateTime.valueOf() + 3000);
const dateTimePlus4 = new Date(dateTime.valueOf() + 4000);
const dateTimePlus5 = new Date(dateTime.valueOf() + 5000);

export const existingBlogPost1 = {
  _id: new mongoose.Types.ObjectId(),
  author: existingUser1ID,
  body: 'This is a brilliant treatise on cube.',
  comments: [
    {
      _id: new mongoose.Types.ObjectId(),
      author: existingUser1ID,
      body: 'I am so smart',
      createdAt: dateTimePlus1.toISOString(),
      updatedAt: dateTimePlus1.toISOString()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      author: existingUser2ID,
      body: "You're dumb",
      createdAt: dateTimePlus2.toISOString(),
      updatedAt: dateTimePlus2.toISOString()
    }
  ],
  image: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/e/6/e6990bf6-3b2a-44c8-b7fb-04d74249abfe.jpg?1562941305',
  subtitle: 'Much Wisdom',
  title: 'Cube 101',
  createdAt: dateTime.toISOString(),
  updatedAt: dateTime.toISOString()
};

export const existingBlogPost2 = {
  _id: new mongoose.Types.ObjectId(),
  author: existingUser1ID,
  body: 'This is a second post.',
  comments: [
    {
      _id: new mongoose.Types.ObjectId(),
      author: existingUser1ID,
      body: 'I am genius',
      createdAt: dateTimePlus4.toISOString(),
      updatedAt: dateTimePlus4.toISOString()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      author: existingUser2ID,
      body: 'Nuh uh',
      createdAt: dateTimePlus5.toISOString(),
      updatedAt: dateTimePlus5.toISOString()
    }
  ],
  image: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/b/a/baeb0421-b7af-44cd-a7f6-7daaa3dcaa38.jpg?1598303782',
  subtitle: 'Wisdom Galore',
  title: 'Cube 102',
  createdAt: dateTimePlus3.toISOString(),
  updatedAt: dateTimePlus3.toISOString()
};

export const nonExistantUser = {
  email: 'unreal@gmail.com',
  password: 'd0ntM4ak3N0M4tt3r'
};

export async function setupDatabase () {
  await Account.deleteMany();
  await Blog.deleteMany();
  await Cube.deleteMany();
  await new Account(existingUser1).save();
  await new Account(existingUser2).save();
  await new Blog(existingBlogPost1).save();
  await new Blog(existingBlogPost2).save();
  await new Cube(existingCube1).save();
}