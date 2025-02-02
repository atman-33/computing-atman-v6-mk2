/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query getTags {\n    tags {\n      id\n      image\n      name\n    }\n  }\n": types.GetTagsDocument,
    "\n  mutation createPost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      title\n      emoji\n      content\n      status\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation deletePost($input: DeletePostInput!) {\n    deletePost(input: $input) {\n      id\n    }\n  }\n": types.DeletePostDocument,
    "\n  query getPost($args: GetPostArgs!) {\n    post(args: $args) {\n      id\n      emoji\n      title\n      status\n      content\n      createdAt\n      updatedAt\n      tags {\n        tag {\n          id\n          name\n          image\n        }\n      }\n    }\n  }\n": types.GetPostDocument,
    "\n  query getPostsByUser($args: GetPostsByUserArgs!, $first: Int, $after: String) {\n    postsByUser(args: $args, first: $first, after: $after) {\n      edges {\n        node {\n          id\n          emoji\n          title\n          status\n          tags {\n            tag {\n              id\n              image\n              name\n            }\n          }\n          createdAt\n          updatedAt\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n": types.GetPostsByUserDocument,
    "\n  mutation updatePost($input: UpdatePostInput!) {\n    updatePost(input: $input) {\n      id\n      title\n      emoji\n      content\n      status\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdatePostDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTags {\n    tags {\n      id\n      image\n      name\n    }\n  }\n"): (typeof documents)["\n  query getTags {\n    tags {\n      id\n      image\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createPost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      title\n      emoji\n      content\n      status\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation createPost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      title\n      emoji\n      content\n      status\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deletePost($input: DeletePostInput!) {\n    deletePost(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deletePost($input: DeletePostInput!) {\n    deletePost(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPost($args: GetPostArgs!) {\n    post(args: $args) {\n      id\n      emoji\n      title\n      status\n      content\n      createdAt\n      updatedAt\n      tags {\n        tag {\n          id\n          name\n          image\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getPost($args: GetPostArgs!) {\n    post(args: $args) {\n      id\n      emoji\n      title\n      status\n      content\n      createdAt\n      updatedAt\n      tags {\n        tag {\n          id\n          name\n          image\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPostsByUser($args: GetPostsByUserArgs!, $first: Int, $after: String) {\n    postsByUser(args: $args, first: $first, after: $after) {\n      edges {\n        node {\n          id\n          emoji\n          title\n          status\n          tags {\n            tag {\n              id\n              image\n              name\n            }\n          }\n          createdAt\n          updatedAt\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query getPostsByUser($args: GetPostsByUserArgs!, $first: Int, $after: String) {\n    postsByUser(args: $args, first: $first, after: $after) {\n      edges {\n        node {\n          id\n          emoji\n          title\n          status\n          tags {\n            tag {\n              id\n              image\n              name\n            }\n          }\n          createdAt\n          updatedAt\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePost($input: UpdatePostInput!) {\n    updatePost(input: $input) {\n      id\n      title\n      emoji\n      content\n      status\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation updatePost($input: UpdatePostInput!) {\n    updatePost(input: $input) {\n      id\n      title\n      emoji\n      content\n      status\n      createdAt\n      updatedAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;