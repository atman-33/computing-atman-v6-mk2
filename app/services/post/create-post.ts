import { initializeClient } from '~/lib/graphql-client';
import { graphql } from '~/lib/graphql/@generated';
import { CreatePostInput, CreatePostMutation } from '~/lib/graphql/@generated/graphql';
import { ApiResponse } from '~/types/api-response';
import { createErrorResponse, createSuccessResponse } from '~/utils/api-response-util';

const createPostGql = graphql(`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      emoji
      content
      status
      createdAt
      updatedAt
    }
  }
`);

type CreatePostResult = CreatePostMutation['createPost'];

const createPost = async (
  input: CreatePostInput,
  request?: Request,
): Promise<ApiResponse<CreatePostResult>> => {
  const client = await initializeClient(request);
  return await client
    .request(createPostGql, {
      input,
    })
    .then(({ createPost }) => createSuccessResponse(201, createPost))
    .catch((error) => {
      // TODO: エラー取得方法は実際のデータを取得しながら要確認！
      const errorJson = JSON.parse(JSON.stringify(error));
      console.log(error);
      return createErrorResponse(errorJson.response?.errors[0].message, 'GraphQL Error', error);
    });
};

export { createPost };
