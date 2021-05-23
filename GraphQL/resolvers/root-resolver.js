// account
// import deleteAccount from './account-resolvers/delete-account.js';
import editAccount from './account-resolvers/edit-account.js';
import fetchAccountByID from './account-resolvers/fetch-account-by-id.js';
import login from './account-resolvers/login.js';
import logoutAllDevices from './account-resolvers/logout-all-devices.js';
import logoutSingleDevice from './account-resolvers/logout-single-device.js';
import register from './account-resolvers/register.js';
import requestPasswordReset from './account-resolvers/request-password-reset.js';
import searchAccounts from './account-resolvers/search-accounts.js';
import submitPasswordReset from './account-resolvers/submit-password-reset.js';

// blog
import createBlogPost from './blog-resolvers/create-blog-post.js';
import createComment from './blog-resolvers/create-comment.js';
import deleteBlogPost from './blog-resolvers/delete-blog-post.js';
import deleteComment from './blog-resolvers/delete-comment.js';
import editBlogPost from './blog-resolvers/edit-blog-post.js';
import searchBlogPosts from './blog-resolvers/search-blog-posts.js';
import fetchBlogPostByID from './blog-resolvers/fetch-blog-post-by-id.js';

// cube
import addCard from './cube-resolvers/add-card.js';
import createCube from './cube-resolvers/create-cube.js';
import createModule from './cube-resolvers/create-module.js';
import createRotation from './cube-resolvers/create-rotation.js';
import deleteCard from './cube-resolvers/delete-card.js';
import deleteCube from './cube-resolvers/delete-cube.js';
import deleteModule from './cube-resolvers/delete-module.js';
import deleteRotation from './cube-resolvers/delete-rotation.js';
import editCard from './cube-resolvers/edit-card.js';
import editCube from './cube-resolvers/edit-cube.js';
import editModule from './cube-resolvers/edit-module.js';
import editRotation from './cube-resolvers/edit-rotation.js';
import fetchCubeByID from './cube-resolvers/fetch-cube-by-id.js';
import searchCubes from './cube-resolvers/search-cubes.js';

// event
import createEvent from './event-resolvers/create-event.js';
import joinEvent from './event-resolvers/join-event.js';
import moveCard from './event-resolvers/move-card.js';
import selectCard from './event-resolvers/select-card.js';
import sortCard from './event-resolvers/sort-card.js';

// custom field resolvers
import author from './blog-resolvers/author.js';
import buds from './account-resolvers/buds.js';
import creator from './cube-resolvers/creator.js';
import cubes from './account-resolvers/cubes.js';
import email from './account-resolvers/email.js';
import events from './account-resolvers/events.js';
import host from './event-resolvers/host.js';
import players from './event-resolvers/players.js';
import received_bud_requests from './account-resolvers/received-bud-requests.js';
import sent_bud_requests from './account-resolvers/sent-bud-requests.js';

export default {
  AccountType: {
    buds,
    cubes,
    email,
    events,
    received_bud_requests,
    sent_bud_requests
  },
  BlogPostType: {
    author
  },
  CommentType: {
    author
  },
  CubeType: {
    creator
  },
  EventType: {
    host,
    players
  },
  Mutation: {
  // account
    // deleteAccount,
    editAccount,
    login,
    logoutAllDevices,
    logoutSingleDevice,
    register,
    requestPasswordReset,
    submitPasswordReset,
  // blog
    createBlogPost,
    createComment,
    deleteBlogPost,
    deleteComment,
    editBlogPost,
  // cube
    addCard,
    createCube,
    createModule,
    createRotation,
    deleteCard,
    deleteCube,
    deleteModule,
    deleteRotation,
    editCard,
    editCube,
    editModule,
    editRotation,
  // event
    createEvent,
    moveCard,
    selectCard,
    sortCard
  },
  Query: {
  // account
    fetchAccountByID,
    searchAccounts,
  // blog
    fetchBlogPostByID,
    searchBlogPosts,
  // cube
    fetchCubeByID,
    searchCubes
  // event
  },
  Subscription: {
    joinEvent,
  // account
  // blog
  // cube
  // event
  }
};