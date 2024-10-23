import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createYoga } from 'graphql-yoga';
import { schema } from '~/lib/graphql/schema';
import { authenticator } from '../auth/services/auth.server';

// console.log(printSchema(schema));  // デバッグ用（スキーマ情報確認）

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
