import { initializeClient } from '~/lib/graphql-client';
import { getOriginalErrorMessage } from '~/lib/graphql-client/client-error';
import { graphql } from '~/lib/graphql/@generated';
import { GetPostsByUserArgs, GetPostsByUserQuery } from '~/lib/graphql/@generated/graphql';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '~/utils/api-response';

const getPostsByUserGql = graphql(`
  query getPostsByUser($args: GetPostsByUserArgs!) {
    postsByUser(args: $args) {
      edges {
        node {
          id
          emoji
          title
          status
          tags {
            tag {
              id
              image
              name
            }
          }
          createdAt
          updatedAt
        }
      }
      totalCount
    }
  }
`);

type GetPostsByUserResult = GetPostsByUserQuery['postsByUser'];

const getPostsByUser = async (
  args: GetPostsByUserArgs,
  request?: Request,
): Promise<ApiResponse<GetPostsByUserResult>> => {
  const client = await initializeClient(request);
  return await client
    .request(getPostsByUserGql, {
      args,
    })
    .then(({ postsByUser }) => {
      postsByUser?.edges;
      return createSuccessResponse(200, postsByUser);
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

export { getPostsByUser };
