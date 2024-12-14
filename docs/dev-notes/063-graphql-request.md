# GraphQL request セットアップ

## ステップ

### インストール

```sh
npm i graphql-request
```

### GraphQL API URLを環境変数に追加

`.env`

```sh
# API GraphQL URL
API_GQL_URL='http://localhost:3000/api/graphql'
```

`app/config/env.ts`

### Clientを作成

`app/lib/graphql-client/index.ts`

```ts
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
```

### データ取得例

`app/routes/__.poc.graphql-test._index/route.tsx`

**注意点**  

- GraphQLコード（下記の例では`getTagsGql`）を記載後、graphql-codegenを実行して、自動コードを更新すること。
- `useLoaderData`で取得したデータは、正常なデータとErrorの型のどちらか判断付かない状態にあるため、先にErrorの型の場合は判定しておくとよい。

```tsx
import { json, useLoaderData } from '@remix-run/react';
import { ClientError } from 'graphql-request';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/shadcn/ui/table';
import { graphql } from '~/lib/graphql/@generated';
import { initializeClient } from '~/lib/graphql-client';

const getTagsGql = graphql(`
  query getTags {
    tags {
      id
      image
      name
    }
  }
`);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = await initializeClient(request);
  return await client
    .request(getTagsGql)
    .then(({ tags }) => {
      return json(tags);
    })
    .catch((error) => {
      if (error instanceof ClientError) {
        return json(
          {
            errorType: 'ClientError',
            error,
          },
          {
            status: 400,
          },
        );
      }
    });
};

const GraphqlTestPage = () => {
  const tags = useLoaderData<typeof loader>();

  if (!tags || 'errorType' in tags) {
    return <div>Error: {tags?.error?.message || 'Unknown error'}</div>;
  }

  return (
    <>
      <Table>
        <TableCaption>A list of tags.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags?.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell>
                {tag.image ? (
                  <img src={tag.image} alt={tag.name ?? undefined} style={{ width: '50px' }} />
                ) : (
                  'No Image'
                )}
              </TableCell>
              <TableCell>{tag.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GraphqlTestPage;
```
