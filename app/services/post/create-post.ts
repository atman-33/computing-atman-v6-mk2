import { initializeClient } from '~/lib/graphql-client';
import { getOriginalErrorMessage } from '~/lib/graphql-client/client-error';
import { graphql } from '~/lib/graphql/@generated';
import { CreatePostInput, CreatePostMutation } from '~/lib/graphql/@generated/graphql';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '~/utils/api-response';

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
    .then(({ createPost }) => {
      return createSuccessResponse(201, createPost);
    })
    .catch((error) => {
      // console.log(error);
      const errorMessage = getOriginalErrorMessage(error);
      if (errorMessage) {
        return createErrorResponse(errorMessage, 'ClientError', error);
      } else {
        return createErrorResponse(error.message, 'UnknownError', error);
      }
    });
};

export { createPost };
