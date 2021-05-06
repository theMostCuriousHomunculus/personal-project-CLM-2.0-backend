// import {
//   buildSchema,
//   GraphQLBoolean,
//   GraphQLID,
//   GraphQLInputObjectType,
//   GraphQLInt,
//   GraphQLList,
//   GraphQLNonNull,
//   GraphQLObjectType,
//   GraphQLSchema,
//   GraphQLString
// } from 'graphql';
// import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
// import { mergeTypeDefs } from '@graphql-tools/merge';

import rootResolver from './resolvers/root-resolver.js';

// const typeDefsArray = loadFilesSync(new URL('./typeDefs', import.meta.url).toString(), { extensions: ['graphql'] });

const typeDefs = `
  input EditAccountInput {
    action: String
    avatar: String
    email: String
    name: String
    other_user_id: String
    password: String
  }

  input EventUpdatedInput {
    cardID: String!
    eventID: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    avatar: String!
    email: String!
    name: String!
    password: String!
  }

  input SubmitPasswordResetInput {
    email: String!
    password: String!
    reset_token: String!
  }

  type AccountType {
    _id: ID
    admin: Boolean
    avatar: String
    buds: [AccountType]
    cubes: [CubeType]
    email: String
    events: [EventType]
    name: String
    received_bud_requests: [AccountType]
    sent_bud_requests: [AccountType]
  }

  type BlogPostType {
    _id: ID
    author: AccountType
    body: String
    comments: [CommentType]
    createdAt: String
    image: String
    subtitle: String
    title: String
    updatedAt: String
  }

  type CardType {
    _id: ID
    back_image: String
    chapters: Int
    cmc: Int
    color_identity: [String]
    image: String
    keywords: [String]
    loyalty: Int
    mana_cost: String
    mtgo_id: Int
    name: String
    oracle_id: String
    power: Int
    printing: String
    purchase_link: String
    toughness: Int
    type_line: String
  }

  type CommentType {
    _id: ID
    author: AccountType
    body: String
    createdAt: String
    updatedAt: String
  }

  type Credentials {
    isAdmin: Boolean
    token: String!
    userId: String!
  }

  type CubeType {
    _id: ID
    creator: AccountType
    description: String
    mainboard: [CardType]
    modules: [ModuleType]
    name: String
    rotations: [RotationType]
    sideboard: [CardType]
  }

  type EventType {
    _id: ID
    createdAt: String
    finished: Boolean
    host: AccountType
    name: String
    players: [PlayerType]
    updatedAt: String
  }

  type ModuleType {
    _id: ID
    cards: [CardType]
    name: String
  }

  type MutationType {
    editAccount(input: EditAccountInput): AccountType!
    login(input: LoginInput!): Credentials!
    logoutAllDevices: Boolean
    logoutSingleDevice: Boolean
    register(input: RegisterInput!): Credentials!
    requestPasswordReset(email: String!): Boolean
    submitPasswordReset(input: SubmitPasswordResetInput!): Credentials!
    createBlogPost(input: CreateBlogPostInput!): BlogPostType!
  }

  type PlayerType {
    account: AccountType
    chaff: [CardType]
    mainboard: [CardType]
    packs: [[CardType]]
    queue: [[CardType]]
    sideboard: [CardType]
  }

  type ProfileType {
    cubes: [Cube]
    events: [Event]
    user: Account!
  }

  type Query {
    fetchAccountByID(_id: ID!): AccountType!
    searchAccounts(name: String!): [AccountType]!
    fetchAllBlogPosts(search: String): [BlogPostType]!
    fetchBlogPostByID(_id: ID!): BlogPostType!
  }

  type RotationType {
    _id: ID
    cards: [CardType]
    name: String
    size: Int
  }

  type Subscription {
    count: Int!
  }
`;

export default makeExecutableSchema({
  resolvers: rootResolver,
  typeDefs: /*mergeTypeDefs(typeDefsArray)*/typeDefs
});

// const DraftCardInput = new GraphQLInputObjectType({
//   name: "DraftCard",
//   fields: {
//     cardID: { type: new GraphQLNonNull(GraphQLString) },
//     eventID: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });

// const EditAccountInput = new GraphQLInputObjectType({
//   name: "EditAccount",
//   fields: {
//     action: { type: GraphQLString },
//     avatar: { type: GraphQLString },
//     email: { type: GraphQLString },
//     name: { type: GraphQLString },
//     other_user_id: { type: GraphQLString },
//     password: { type: GraphQLString }
//   }
// });

// const LoginInput = new GraphQLInputObjectType({
//   name: "Login",
//   fields: {
//     email: { type: new GraphQLNonNull(GraphQLString) },
//     password: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });

// const RegisterInput = new GraphQLInputObjectType({
//   name: "Register",
//   fields: {
//     avatar: { type: new GraphQLNonNull(GraphQLString) },
//     email: { type: new GraphQLNonNull(GraphQLString) },
//     name: { type: new GraphQLNonNull(GraphQLString) },
//     password: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });

// const SubmitPasswordResetInput = new GraphQLInputObjectType({
//   name: "SubmitPasswordReset",
//   fields: {
//     email: { type: new GraphQLNonNull(GraphQLString) },
//     password: { type: new GraphQLNonNull(GraphQLString) },
//     reset_token: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });

// const AccountType = new GraphQLObjectType({
//   name: "Account",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     admin: { type: GraphQLBoolean },
//     avatar: { type: GraphQLString },
//     buds: { type: new GraphQLList(AccountType) },
//     email: { type: GraphQLString },
//     name: { type: GraphQLString },
//     password: { type: GraphQLString },
//     received_bud_requests: { type: new GraphQLList(AccountType) },
//     reset_token: { type: GraphQLString },
//     reset_token_expiration: { type: GraphQLString },
//     sent_bud_requests: { type: new GraphQLList(AccountType) },
//     tokens: { type: new GraphQLList(TokenType) }
//   }
// });

// const CardType = new GraphQLObjectType({
//   name: "Card",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     back_image: { type: GraphQLString },
//     chapters: { type: GraphQLInt },
//     cmc: { type: GraphQLInt },
//     color_identity: { type: new GraphQLList(GraphQLString) },
//     image: { type: GraphQLString },
//     keywords: { type: new GraphQLList(GraphQLString) },
//     loyalty: { type: GraphQLInt },
//     mana_cost: { type: GraphQLString },
//     mtgo_id: { type: GraphQLInt },
//     name: { type: GraphQLString },
//     oracle_id: { type: GraphQLString },
//     power: { type: GraphQLInt },
//     printing: { type: GraphQLString },
//     purchase_link: { type: GraphQLString },
//     toughness: { type: GraphQLInt },
//     type_line: { type: GraphQLString }
//   }
// });

// const CredentialsType = new GraphQLObjectType({
//   name: "Credentials",
//   fields: {
//     isAdmin: { type: GraphQLBoolean },
//     token: { type: new GraphQLNonNull(GraphQLString) },
//     userId: { type: new GraphQLNonNull(GraphQLString) },
//   }
// });

// const CubeType = new GraphQLObjectType({
//   name: "Cube",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     creator: { type: AccountType },
//     description: { type: GraphQLString },
//     mainboard: { type: new GraphQLList(CardType) },
//     modules: { type: new GraphQLList(ModuleType) },
//     name: { type: new GraphQLNonNull(GraphQLString) },
//     rotations: { type: new GraphQLList(RotationType) },
//     sideboard: { type: new GraphQLList(CardType) }
//   }
// });

// const EventType = new GraphQLObjectType({
//   name: "Event",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     createdAt: { type: GraphQLString },
//     finished: { type: GraphQLBoolean },
//     host: { type: AccountType },
//     name: { type: GraphQLString },
//     players: { type: new GraphQLList(PlayerType) },
//     updatedAt: { type: GraphQLString }
//   }
// });

// const ModuleType = new GraphQLObjectType({
//   name: "Module",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     cards: { type: new GraphQLList(CardType) },
//     name: { type: GraphQLString }
//   }
// });

// const PlayerType = new GraphQLObjectType({
//   name: "Player",
//   fields: {
//     account: { type: AccountType },
//     chaff: { type: new GraphQLList(CardType) },
//     mainboard: { type: new GraphQLList(CardType) },
//     packs: { type: new GraphQLList(new GraphQLList(CardType)) },
//     queue: { type: new GraphQLList(new GraphQLList(CardType)) },
//     sideboard: { type: new GraphQLList(CardType) }
//   }
// })

// const ProfileDataType = new GraphQLObjectType({
//   name: "ProfileData",
//   fields: {
//     cubes: { type: new GraphQLList(CubeType) },
//     events: { type: new GraphQLList(EventType) },
//     user: { type: new GraphQLNonNull(AccountType) }
//   }
// });

// const RotationType = new GraphQLObjectType({
//   name: "Rotation",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     cards: { type: new GraphQLList(CardType) },
//     name: { type: GraphQLString },
//     size: { type: GraphQLInt }
//   }
// });

// const TokenType = new GraphQLObjectType({
//   name: "Token",
//   fields: {
//     _id: { type: new GraphQLNonNull(GraphQLID) },
//     token: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });