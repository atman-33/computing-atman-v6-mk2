import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createYoga } from 'graphql-yoga';
import { schema } from '~/lib/graphql/schema';

// NOTE: createYogaで生成したインスタンスはシングルトンとして利用される。
const yoga = createYoga({
  schema, // スキーマとリゾルバーを定義
  graphqlEndpoint: '/api/graphql',
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
