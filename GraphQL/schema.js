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
  input EditAccountData {
    action: String
    avatar: String
    email: String
    name: String
    other_user_id: String
    password: String
  }

  input EventUpdatedData {
    cardID: String!
    eventID: String!
  }

  input LoginData {
    email: String!
    password: String!
  }

  input RegisterData {
    avatar: String!
    email: String!
    name: String!
    password: String!
  }

  input SubmitPasswordResetData {
    email: String!
    password: String!
    reset_token: String!
  }

  type Account {
    _id: ID
    admin: Boolean
    avatar: String
    buds: [Account]
    email: String
    name: String
    password: String
    received_bud_requests: [Account]
    reset_token: String
    reset_token_expiration: String
    sent_bud_requests: [Account]
    tokens: [Token]
  }

  type Card {
    _id: ID!
    back_image: String
    chapters: Int
    cmc: Int
    color_identity: [String!]
    image: String
    keywords: [String!]
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

  type Credentials {
    isAdmin: Boolean
    token: String!
    userId: String!
  }

  type Cube {
    _id: ID!
    creator: Account
    description: String
    mainboard: [Card]
    modules: [Module]
    name: String!
    rotations: [Rotation]
    sideboard: [Card]
  }

  type Event {
    _id: ID!
    createdAt: String
    finished: Boolean
    host: Account
    name: String!
    players: [Player]
    updatedAt: String
  }

  type Module {
    _id: ID
    cards: [Card]
    name: String
  }

  type Mutation {
    editAccount(input: EditAccountData): Boolean
    login(input: LoginData!): Credentials!
    logoutAllDevices: Boolean
    logoutSingleDevice: Boolean
    register(input: RegisterData!): Credentials!
    requestPasswordReset(email: String!): Boolean
    submitPasswordReset(input: SubmitPasswordResetData): Credentials!
  }

  type Player {
    account: Account
    chaff: [Card]
    mainboard: [Card]
    packs: [[Card]]
    queue: [[Card]]
    sideboard: [Card]
  }

  type ProfileData {
    cubes: [Cube]
    events: [Event]
    user: Account!
  }

  type Query {
    fetchAccountByID(_id: ID!): ProfileData!
    searchAccounts(name: String!): [Account]!
  }

  type Rotation {
    _id: ID
    cards: [Card]
    name: String
    size: Int
  }

  type Subscription {
    count: Int!
  }

  type Token {
    _id: ID!
    token: String!
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