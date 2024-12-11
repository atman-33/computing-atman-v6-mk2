import { GraphQLClient } from 'graphql-request';
import { graphql } from '~/lib/graphql/@generated';
import { IPostRespository } from '~/services.server/domain/models/post/ipost.repository';
import { PostDomain } from '~/services.server/domain/models/post/post.domain';

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

export class GraphqlPostRepository implements IPostRespository {
  constructor(private readonly client: GraphQLClient) {}

  async create(post: PostDomain): Promise<PostDomain> {
    const data = await this.client.request(createPostGql, {
      input: {
        title: post.title.value,
        emoji: post.emoji.value,
        content: post.content.value,
        status: post.status.value,
      },
    });

    return PostDomain.reconstruct(
      data.id,
      data.title,
      data.emoji,
      data.content,
      data.status,
      data.au,
    );

    // return null;
    // return PostDomain.reconstruct(data.)
  }
}
