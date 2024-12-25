import { GetPostsByUserQuery } from '~/lib/graphql/@generated/graphql';

type PostsByUser = GetPostsByUserQuery['postsByUser'];
type PostsPageInfo = NonNullable<PostsByUser>['pageInfo'];
type PostEdges = NonNullable<PostsByUser>['edges'];
type PostEdge = NonNullable<PostEdges>[number];
type PostNode = NonNullable<PostEdge>['node'];

export type { PostEdges, PostNode, PostsPageInfo };
