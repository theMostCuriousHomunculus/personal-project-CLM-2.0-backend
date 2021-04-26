import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { app, RESTserver } from './server.js';
import graphqlResolver from './GraphQL/resolvers/root-resolver.js';
import graphqlSchema from './GraphQL/schemas/graphql-schema.js';

RESTserver.listen(process.env.PORT, function () {
  console.log(`The REST server is up on port ${process.env.PORT}.`);
});

const GraphQLserver = app.listen(5001, () => {
  const wsServer = new ws.Server({
    server: GraphQLserver,
    path: '/graphql'
  });
  useServer({ schema: graphqlSchema, roots: graphqlResolver }, wsServer);
  console.log('The GraphQL server is up on port 5001.');
});