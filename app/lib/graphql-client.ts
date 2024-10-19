import { GraphQLClient } from 'graphql-request';
import { env } from '~/config/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeClient = async (request: Request | undefined) => {
  const client = new GraphQLClient(env.API_GQL_URL, {
    fetch: fetch,
  });

  return client;
};
