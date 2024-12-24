import { initializeClient } from '~/lib/graphql-client';
import { getOriginalErrorMessage } from '~/lib/graphql-client/client-error';
import { graphql } from '~/lib/graphql/@generated';
import { GetPostArgs, GetPostQuery } from '~/lib/graphql/@generated/graphql';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '~/utils/api-response';

const getPostGql = graphql(`
  query getPost($args: GetPostArgs!) {
    post(args: $args) {
      id
      emoji
      title
      status
      content
      tags {
        tag {
          id
          name
          image
        }
      }
    }
  }
`);

type GetPostResult = GetPostQuery['post'];

const getPost = async (
  args: GetPostArgs,
  request?: Request,
): Promise<ApiResponse<GetPostResult>> => {
  const client = await initializeClient(request);
  return await client
    .request(getPostGql, {
      args,
    })
    .then(({ post }) => {
      return createSuccessResponse(200, post);
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

export { getPost };
