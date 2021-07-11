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
    current_pack
    mainboard
    sideboard
  }

  enum DeckComponentEnum {
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

  enum FormatEnum {
    Legacy
    Modern
    Pauper
    Pioneer
    Standard
    Vintage
  }

  enum PlayZoneEnum {
    battlefield
    exile
    graveyard
    hand
    library
    mainboard
    sideboard
    stack
    temporary
  }

  input AddCardsToDeckInput {
    card: CollectionCardInput!
    component: DeckComponentEnum!
    numberOfCopies: Int!
  }

  input AddCardToCubeInput {
    card: CollectionCardInput!
    componentID: String!
  }

  input AdjustCountersInput {
    cardID: String!
    controllerID: String!
    counterAmount: Int!
    counterType: Int!
    zone: PlayZoneEnum!
  }

  input BlogPostInput {
    body: String!
    image: String!
    subtitle: String
    title: String!
  }

  input CardIDZoneInput {
    cardID: ID!
    zone: PlayZoneEnum!
  }

  input ChangeFaceDownImageInput {
    cardID: String!
    faceDownImage: FaceDownImageEnum!
    zone: PlayZoneEnum!
  }

  input CollectionCardInput {
    back_image: String
    cmc: Int!
    collector_number: Int!
    color_identity: [String]!
    image: String!
    keywords: [String]!
    mana_cost: String!
    mtgo_id: Int
    name: String!
    oracle_id: String!
    scryfall_id: String!
    set: String!
    set_name: String!
    tcgplayer_id: Int
    type_line: String!
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
    event_type: EventEnum!
    modules: [String]
    name: String!
    other_players: [String]
    packs_per_player: Int!
  }

  input CreateMatchInput {
    deckIDs: [ID]
    eventID: ID
    playerIDs: [ID]!
  }

  input CreateTokensInput {
    token: TokenInput!
    numberOfTokens: Int!
  }

  input DeckInput {
    description: String
    existingListID: String
    format: FormatEnum
    name: String
  }

  input DeleteCardInput {
    cardID: String!
    originID: String!
    destinationID: String
  }

  input DeleteCommentInput {
    blogPostID: String!
    commentID: String!
  }

  input DragCardInput {
    cardID: String!
    xCoordinate: Float!
    yCoordinate: Float!
    zIndex: Int!
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
    cardID: ID!
    componentID: ID!
    back_image: String
    collector_number: Int!
    image: String!
    mtgo_id: Int
    scryfall_id: String!
    set: String!
    set_name: String!
    tcgplayer_id: Int
  }

  input EditCubeInput {
    description: String
    name: String
  }

  input EditModuleInput {
    moduleID: ID!
    name: String
  }

  input EditRotationInput {
    rotationID: ID!
    name: String
    size: Int
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
    origin: CollectionEnum!
  }

  input RegisterInput {
    avatar: String!
    email: String!
    name: String!
    password: String!
  }

  input RemoveCardsFromDeckInput {
    cardIDs: [ID]!
    component: DeckComponentEnum!
  }

  input SortCardInput {
    collection: CollectionEnum!
    newIndex: Int!
    oldIndex: Int!
  }

  input SubmitPasswordResetInput {
    email: String!
    password: String!
    reset_token: String!
  }

  input TapUntapCardsInput {
    cardIDs: [ID!]!
  }

  input TokenInput {
    back_image: String
    image: String!
    name: String!
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
    decks: [DeckType]
    email: String
    events: [EventType]
    matches: [MatchType]
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

  type CollectionCardType {
    _id: ID
    back_image: String
    cmc: Int
    collector_number: Int
    color_identity: [String]
    image: String
    keywords: [String]
    mana_cost: String
    mtgo_id: Int
    name: String
    oracle_id: String
    scryfall_id: String
    set: String
    set_name: String
    tcgplayer_id: String
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
    mainboard: [CollectionCardType]
    modules: [ModuleType]
    name: String
    rotations: [RotationType]
    sideboard: [CollectionCardType]
  }

  type DeckType {
    _id: ID
    creator: AccountType
    description: String
    format: FormatEnum
    mainboard: [CollectionCardType]
    name: String
    sideboard: [CollectionCardType]
  }

  type EventPlayerType {
    account: AccountType
    current_pack: [CollectionCardType]
    mainboard: [CollectionCardType]
    sideboard: [CollectionCardType]
  }

  type EventType {
    _id: ID
    createdAt: String
    cube: CubeType
    finished: Boolean
    host: AccountType
    name: String
    players: [EventPlayerType]
    updatedAt: String
  }

  type MatchCardType {
    _id: ID
    back_image: String
    cmc: Int
    controller: AccountType
    counters: [CounterObjectType]
    face_down: Boolean
    face_down_image: String
    flipped: Boolean
    image: String
    index: Int
    isCopyToken: Boolean
    mana_cost: String
    name: String
    owner: AccountType
    scryfall_id: String
    set: String
    tapped: Boolean
    targets: [MatchCardType]
    type_line: String
    visibility: [AccountType]
    x_coordinate: Float
    y_coordinate: Float
    z_index: Int
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
    cards: [CollectionCardType]
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
    createBlogPost(input: BlogPostInput!): BlogPostType
    createComment(body: String!): BlogPostType
    deleteBlogPost(_id: ID!): Boolean
    deleteComment(input: DeleteCommentInput!): Boolean
    editBlogPost(input: BlogPostInput!): BlogPostType
    addCardToCube(input: AddCardToCubeInput!): CubeType
    createCube(input: CreateCubeInput!): CubeType!
    createModule(name: String!): CubeType
    createRotation(name: String!): CubeType
    deleteCard(input: DeleteCardInput!): Boolean
    deleteCube: Boolean
    deleteModule(_id: ID!): Boolean
    deleteRotation(_id: ID!): Boolean
    editCard(input: EditCardInput!): CubeType
    editCube(input: EditCubeInput!): CubeType
    editModule(input: EditModuleInput!): CubeType
    editRotation(input: EditRotationInput!): CubeType
    addCardsToDeck(input: AddCardsToDeckInput!): DeckType
    changeCardPrinting(input: String!): DeckType
    createDeck(input: DeckInput!): DeckType
    deleteDeck: Boolean
    editDeck(input: DeckInput!): DeckType
    removeCardsFromDeck(input: RemoveCardsFromDeckInput!): DeckType
    toggleMainboardSideboardDeck(cardID: ID!): DeckType
    addBasics(input: AddCardsToDeckInput!): EventType
    createEvent(input: CreateEventInput!): EventType!
    toggleMainboardSideboardEvent(cardID: ID!): EventType
    removeBasics(input: RemoveCardsFromDeckInput!): EventType
    selectCard(_id: ID!): EventType
    sortCard(input: SortCardInput!): EventType
    adjustCounters(input: AdjustCountersInput!): MatchType
    adjustEnergyCounters(energy: Int!): MatchType
    adjustLifeTotal(life: Int!): MatchType
    adjustPoisonCounters(poison: Int!): MatchType
    changeFaceDownImage(input: ChangeFaceDownImageInput!): MatchType
    concedeGame: MatchType
    createCopies(input: CreateCopiesInput!): MatchType
    createMatch(input: CreateMatchInput!): MatchType!
    createTokens(input: CreateTokensInput!): MatchType
    destroyCopyToken(input: CardIDZoneInput!): MatchType
    dragCard(input: DragCardInput!): MatchType
    drawCard: MatchType
    flipCard(input: CardIDZoneInput!): MatchType
    flipCoin: MatchType
    gainControlOfCard(input: GainControlOfCardInput): MatchType
    ready: MatchType
    revealCard(input: CardIDZoneInput!): MatchType
    rollDice(sides: Int!): MatchType
    shuffleLibrary: MatchType
    tapUntapCards(input: TapUntapCardsInput!): MatchType
    toggleMainboardSideboardMatch(cardID: ID!): MatchType
    transferCard(input: TransferCardInput!): MatchType
    turnCard(input: CardIDZoneInput!): MatchType
    viewCard(input: ViewCardInput!): MatchType
    viewZone(input: ViewZoneInput!): MatchType
  }

  type Query {
    fetchAccountByID(_id: ID!): AccountType!
    searchAccounts(name: String): [AccountType]!
    fetchBlogPostByID: BlogPostType!
    searchBlogPosts(search: String): [BlogPostType]!
    fetchCubeByID: CubeType!
    searchCubes(search: String): [CubeType]!
    fetchDeckByID: DeckType!
    fetchEventByID: EventType!
    fetchMatchByID: MatchType!
  }

  type RotationType {
    _id: ID
    cards: [CollectionCardType]
    name: String
    size: Int
  }

  type Subscription {
    subscribeBlogPost: BlogPostType!
    subscribeCube: CubeType!
    subscribeDeck: DeckType!
    subscribeEvent: EventType!
    subscribeMatch: MatchType!
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