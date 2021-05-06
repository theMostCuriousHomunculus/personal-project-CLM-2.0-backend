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
import fetchAllBlogPosts from './blog-resolvers/fetch-all-blog-posts.js';
import fetchBlogPostByID from './blog-resolvers/fetch-blog-post-by-id.js';

// cube
import addCard from './cube-resolvers/add-card.js';
import createComponent from './cube-resolvers/create-component.js';
import createCube from './cube-resolvers/create-cube.js';
import deleteCard from './cube-resolvers/delete-card.js';
import deleteComponent from './cube-resolvers/delete-component.js';
import deleteCube from './cube-resolvers/delete-cube.js';
import editCard from './cube-resolvers/edit-card.js';
import editComponent from './cube-resolvers/edit-component.js';
import editCube from './cube-resolvers/edit-cube.js';
import fetchCubeByID from './cube-resolvers/fetch-cube-by-id.js';
// import searchCubes from './cube-resolvers/search-cubes.js';

// event
import count from './event-resolvers/select-card.js';

// relational mappings
import account from './event-resolvers/account.js';
import author from './blog-resolvers/author.js';
import buds from './account-resolvers/buds.js';
import creator from './cube-resolvers/creator.js';
import cubes from './account-resolvers/cubes.js';
import events from './account-resolvers/events.js';
import host from './event-resolvers/host.js';
import received_bud_requests from './account-resolvers/received-bud-requests.js';
import sent_bud_requests from './account-resolvers/sent-bud-requests.js';

export default {
  AccountType: {
    buds,
    cubes,
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
    host
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
    createComponent,
    createCube,
    deleteCard,
    deleteComponent,
    deleteCube,
    editCard,
    editComponent,
    editCube,
  // event
  },
  PlayerType: {
    account
  },
  Query: {
  // account
    fetchAccountByID,
    searchAccounts,
  // blog
    fetchAllBlogPosts,
    fetchBlogPostByID,
  // cube
    fetchCubeByID,
  // event
  },
  Subscription: {
    count,
  // account
  // blog
  // cube
  // event
  }
};