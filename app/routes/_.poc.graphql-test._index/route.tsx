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

export const loader = async () => {
  const client = await initializeClient(undefined);
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