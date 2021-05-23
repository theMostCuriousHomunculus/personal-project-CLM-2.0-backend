import ws from 'ws';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';

import HTTPserver from './server.js';
import schema from './GraphQL/schema.js';

// https://www.npmjs.com/package/graphql-ws#express
// https://www.graphql-tools.com/docs/server-setup/#adding-subscriptions-support
// https://the-guild.dev/blog/graphql-over-websockets
// https://github.com/graphql/express-graphql#setup-with-subscription-support
// https://the-guild.dev/blog/subscriptions-and-live-queries-real-time-with-graphql

HTTPserver.listen(process.env.PORT, function (req) {
  const pubsub = new PubSub();
  req.pubsub = pubsub;
  const WSserver = new ws.Server({
    server: HTTPserver,
    path: '/graphql'
  });
  useServer({ /*context: { pubsub, req }, */schema }, WSserver);
  console.log(`The server is up on port ${process.env.PORT}.`);
});