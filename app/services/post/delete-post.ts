import { initializeClient } from '~/lib/graphql-client';
import { getOriginalErrorMessage } from '~/lib/graphql-client/client-error';
import { graphql } from '~/lib/graphql/@generated';
import { DeletePostInput, DeletePostMutation } from '~/lib/graphql/@generated/graphql';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '~/utils/api-response';

export const deletePostGql = graphql(`
  mutation deletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      id
    }
  }
`);

type DeletePostResult = DeletePostMutation['deletePost'];

const deletePost = async (
  input: DeletePostInput,
  request?: Request,
): Promise<ApiResponse<DeletePostResult>> => {
  const client = await initializeClient(request);
  return await client
    .request(deletePostGql, {
      input,
    })
    .then(({ deletePost }) => {
      return createSuccessResponse(200, deletePost);
    })
    .catch((error) => {
      const errorMessage = getOriginalErrorMessage(error);
      if (errorMessage) {
        return createErrorResponse(errorMessage, 'ClientError', error);
      } else {
        return createErrorResponse(error.message, 'UnknownError', error);
      }
    });
};

export { deletePost };
