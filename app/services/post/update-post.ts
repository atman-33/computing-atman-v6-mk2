import { initializeClient } from '~/lib/graphql-client';
import { getOriginalErrorMessage } from '~/lib/graphql-client/client-error';
import { graphql } from '~/lib/graphql/@generated';
import { UpdatePostInput, UpdatePostMutation } from '~/lib/graphql/@generated/graphql';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '~/utils/api-response';

const updatePostGql = graphql(`
  mutation updatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
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

type UpdatePostResult = UpdatePostMutation['updatePost'];

const updatePost = async (
  input: UpdatePostInput,
  request?: Request,
): Promise<ApiResponse<UpdatePostResult>> => {
  const client = await initializeClient(request);
  return await client
    .request(updatePostGql, {
      input,
    })
    .then(({ updatePost }) => {
      return createSuccessResponse(200, updatePost);
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

export { updatePost };
