import { GraphQLClient } from 'graphql-request';
import { env } from '~/config/env';

export const initializeClient = async (request: Request | undefined = undefined) => {
  const headers: Record<string, string> = {};

  if (request) {
    try {
      // 特定の重要なヘッダーのみを選択的に追加
      const selectHeaders = [
        // NOTE: GraphQLのユーザー情報取得に必要
        'cookie',
      ];

      selectHeaders.forEach((headerName) => {
        const headerValue = request.headers.get(headerName);
        if (headerValue) {
          headers[headerName] = headerValue;
        }
      });
    } catch (error) {
      console.error('ヘッダー取得中にエラーが発生しました:', error);
    }
  }
  // console.log(headers);

  // GraphQLClientの初期化
  const client = new GraphQLClient(env.API_GQL_URL, {
    fetch: fetch,
    headers: {
      // NOTE: Content-Typeを指定しないとGqphQLの構文エラーとなる。
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  return client;
};
