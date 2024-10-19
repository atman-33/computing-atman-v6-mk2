# GraphQL YOGAセットアップ

- GraphQLサーバー: GraphQL Yoga

## ステップ

### パッケージをインストール

```sh
npm i graphql graphql-yoga
```

### GraphQLサーバーのエンドポイントを作成

`app/routes/api.graphql/route.ts`

```ts
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createSchema, createYoga } from 'graphql-yoga';

// Define your schema and resolvers
const typeDefs = /* GraphQL */ `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from Yoga!',
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイントを指定
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
```

Yoga GraphiQL にアクセスしてみる。  

```sh
npm run dev
```

ブラウザから`localhost:xxxx/api/graphql`のエンドポイントを開く。

### 認証処理を追加

`app/routes/api.graphql/route.ts`

- GraphqlYogaに、contextを追加

```ts
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createYoga } from 'graphql-yoga';
import { schema } from '~/lib/graphql/schema';
import { authenticator } from '../auth/services/auth.server';

// NOTE: createYogaで生成したインスタンスはシングルトンとして利用される。
const yoga = createYoga({
  schema, // スキーマとリゾルバーを定義
  graphqlEndpoint: '/api/graphql',
  context: async (ctx) => {
    // 認証処理
    const user = await authenticator.isAuthenticated(ctx.request);
    // console.log(user);
    return { ...ctx, user };
  },
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
```
