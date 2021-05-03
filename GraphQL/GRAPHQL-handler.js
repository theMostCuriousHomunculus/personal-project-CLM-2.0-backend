import { graphqlHTTP } from 'express-graphql';

import pubsub from './pubsub.js';
import schema from './schema.js';

export default function (req) {
  return graphqlHTTP({
    context: { pubsub, req },
    customFormatErrorFn(error) {
      if (!error.originalError) {
        return error;
      } else {
        const data = error.originalError.data;
        const message = error.message;
        const code = error.originalError.code || 500;
  
        return {
          data,
          message,
          status: code
        };
      }
    },
    // graphiql: { subscriptionEndpoint: `ws://localhost:${process.env.PORT}/subscriptions` },
    schema
  });
};