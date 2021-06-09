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
  enum CollectionEnum {
    chaff
    current_pack
    mainboard
    sideboard
  }

  enum EventEnum {
    draft
    sealed
  }

  enum FaceDownImageEnum {
    foretell
    manifest
    morph
    standard
  }

  enum PlayZoneEnum {
    battlefield
    exile
    graveyard
    hand
    library
    sideboard
    stack
    temporary
  }

  input AddCardInput {
    back_image: String
    chapters: Int
    cmc: Int
    color_identity: [String]
    image: String!
    keywords: [String]
    loyalty: Int
    mana_cost: String
    mtgo_id: Int
    name: String!
    oracle_id: String!
    power: Int
    printing: String!
    purchase_link: String
    toughness: Int
    type_line: String
  }

  input AdjustCountersInput {
    cardID: String!
    controllerID: String!
    counterAmount: Int!
    counterType: Int!
    zone: PlayZoneEnum!
  }

  input BlogPostInput {
    _id: String
    body: String!
    image: String!
    subtitle: String
    title: String!
  }

  input ChangeFaceDownImageInput {
    cardID: String!
    faceDownImage: FaceDownImageEnum!
    zone: PlayZoneEnum!
  }

  input CreateCommentInput {
    body: String!
    blogPostID: String!
  }

  input CreateCopiesInput {
    cardID: String!
    controllerID: String!
    numberOfCopies: Int!
    zone: PlayZoneEnum!
  }

  input CreateCubeInput {
    cobraID: String
    description: String
    name: String!
  }

  input CreateEventInput {
    cards_per_pack: Int!
    cubeID: String!
    event_type: EventEnum!
    modules: [String]
    name: String!
    other_players: [String]
    packs_per_player: Int!
  }

  input CreateMatchInput {
    eventID: String
    playerIDs: [String!]!
  }

  input CreateModuleInput {
    cubeID: String!
    name: String!
  }

  input CreateRotationInput {
    cubeID: String!
    name: String!
    size: Int
  }

  input CreateTokensInput {
    numberOfTokens: Int!
    scryfallID: String!
  }

  input DeleteCardInput {
    cardID: String!
    componentID: String!
    cubeID: String!
    destinationID: String
  }

  input DeleteCommentInput {
    blogPostID: String!
    commentID: String!
  }

  input DeleteModuleInput {
    cubeID: String!
    moduleID: String!
  }

  input DeleteRotationInput {
    cubeID: String!
    rotationID: String!
  }

  input DragCardInput {
    cardID: String!
    xCoordinate: Float!
    yCoordinate: Float!
  }

  input EditAccountInput {
    action: String
    avatar: String
    email: String
    name: String
    other_user_id: String
    password: String
  }

  input EditCardInput {
    cardID: String!
    componentID: String!
    cubeID: String!
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

  input EditCubeInput {
    cubeID: String!
    description: String
    name: String
  }

  input EditModuleInput {
    cubeID: String!
    moduleID: String!
    name: String
  }

  input EditRotationInput {
    cubeID: String!
    rotationID: String!
    name: String
    size: Int
  }

  input EventUpdatedInput {
    cardID: String!
    eventID: String!
  }

  input FlipCardInput {
    cardID: String!
    zone: PlayZoneEnum!
  }

  input GainControlOfCardInput {
    cardID: String!
    controllerID: String!
    zone: PlayZoneEnum!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input MoveCardInput {
    cardID: String!
    destination: CollectionEnum!
    eventID: String!
    origin: CollectionEnum!
  }

  input RegisterInput {
    avatar: String!
    email: String!
    name: String!
    password: String!
  }

  input RevealCardInput {
    cardID: String!
    zone: PlayZoneEnum!
  }

  input SelectCardInput {
    cardID: String!
    eventID: String!
  }

  input SortCardInput {
    collection: CollectionEnum!
    eventID: String!
    newIndex: Int!
    oldIndex: Int!
  }

  input SubmitPasswordResetInput {
    email: String!
    password: String!
    reset_token: String!
  }

  input TransferCardInput {
    cardID: String!
    destinationZone: PlayZoneEnum!
    index: Int
    originZone: PlayZoneEnum!
    reveal: Boolean!
    shuffle: Boolean!
  }

  input ViewCardInput {
    cardID: String!
    controllerID: String!
    zone: PlayZoneEnum!
  }

  input ViewZoneInput {
    controllerID: String!
    zone: PlayZoneEnum!
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

  type CubeCardType {
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

  type CounterObjectType {
    counterAmount: Int,
    counterType: String
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
    mainboard: [CubeCardType]
    modules: [ModuleType]
    name: String
    rotations: [RotationType]
    sideboard: [CubeCardType]
  }

  type EventPlayerType {
    account: AccountType
    chaff: [CubeCardType]
    current_pack: [CubeCardType]
    mainboard: [CubeCardType]
    sideboard: [CubeCardType]
  }

  type EventType {
    _id: ID
    createdAt: String
    finished: Boolean
    host: AccountType
    name: String
    players: [EventPlayerType]
    updatedAt: String
  }

  type MatchCardType {
    _id: ID
    back_image: String
    controller: AccountType
    counters: [CounterObjectType]
    face_down_image: String
    flipped: Boolean
    image: String
    index: Int
    isCopyToken: Boolean
    name: String
    owner: AccountType
    tapped: Boolean
    targets: [MatchCardType]
    tokens: [TokenType]
    visibility: [AccountType]
    x_coordinate: Float
    y_coordinate: Float
  }

  type MatchPlayerType {
    account: AccountType
    battlefield: [MatchCardType]
    energy: Int
    exile: [MatchCardType]
    graveyard: [MatchCardType]
    hand: [MatchCardType]
    library: [MatchCardType]
    life: Int
    mainboard: [MatchCardType]
    poison: Int
    sideboard: [MatchCardType]
    temporary: [MatchCardType]
  }

  type MatchType {
    _id: ID
    cube: CubeType
    event: EventType
    game_winners: AccountType
    log: [String]
    players: [MatchPlayerType]
    stack: [MatchCardType]
  }

  type ModuleType {
    _id: ID
    cards: [CubeCardType]
    name: String
  }

  type Mutation {
    editAccount(input: EditAccountInput): AccountType!
    login(input: LoginInput!): Credentials!
    logoutAllDevices: Boolean
    logoutSingleDevice: Boolean
    register(input: RegisterInput!): Credentials!
    requestPasswordReset(email: String!): Boolean
    submitPasswordReset(input: SubmitPasswordResetInput!): Credentials!
    createBlogPost(input: BlogPostInput!): BlogPostType!
    createComment(input: CreateCommentInput!): BlogPostType!
    deleteBlogPost(_id: ID!): Boolean
    deleteComment(input: DeleteCommentInput!): Boolean
    editBlogPost(input: BlogPostInput!): BlogPostType!
    addCard(input: AddCardInput!): CubeCardType!
    createCube(input: CreateCubeInput!): CubeType!
    createModule(input: CreateModuleInput!): ModuleType!
    createRotation(input: CreateRotationInput!): RotationType!
    deleteCard(input: DeleteCardInput!): CubeType!
    deleteCube(cubeID: String!): Boolean
    deleteModule(input: DeleteModuleInput!): Boolean
    deleteRotation(input: DeleteRotationInput!): Boolean
    editCard(input: EditCardInput!): CubeCardType!
    editCube(input: EditCubeInput!): CubeType!
    editModule(input: EditModuleInput!): ModuleType!
    editRotation(input: EditRotationInput!): RotationType!
    createEvent(input: CreateEventInput!): EventType!
    moveCard(input: MoveCardInput!): EventType
    selectCard(input: SelectCardInput!): EventType
    sortCard(input: SortCardInput!): EventType
    adjustCounters(input: AdjustCountersInput!): MatchType
    adjustLifeTotal(life: Int!): MatchType
    changeFaceDownImage(input: ChangeFaceDownImageInput!): MatchType
    concedeGame: MatchType
    createCopies(input: CreateCopiesInput!): MatchType
    createMatch(input: CreateMatchInput!): MatchType!
    createTokens(input: CreateTokensInput!): MatchType
    dragCard(input: DragCardInput!): MatchType
    flipCard(input: FlipCardInput!): MatchType
    flipCoin: MatchType
    gainControlOfCard(input: GainControlOfCardInput): MatchType
    revealCard(input: RevealCardInput!): MatchType
    rollDice(sides: Int!): MatchType
    shuffleLibrary: MatchType
    tapUntapCard(_id: ID!): MatchType
    transferCard(input: TransferCardInput!): MatchType
    viewCard(input: ViewCardInput!): MatchType
    viewZone(input: ViewZoneInput!): MatchType
  }

  type Query {
    fetchAccountByID(_id: ID!): AccountType!
    searchAccounts(name: String): [AccountType]!
    fetchBlogPostByID(_id: ID!): BlogPostType!
    searchBlogPosts(search: String): [BlogPostType]!
    fetchCubeByID(_id: ID!): CubeType!
    searchCubes(search: String): [CubeType]!
    fetchEventByID(_id: ID!): EventType!
    fetchMatchByID(_id: ID!): MatchType!
  }

  type RotationType {
    _id: ID
    cards: [CubeCardType]
    name: String
    size: Int
  }

  type Subscription {
    joinEvent(_id: ID!): EventType!
    joinEvent(_id: ID!): MatchType!
  }

  type TokenType {
    name: String
    scryfall_id: String
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