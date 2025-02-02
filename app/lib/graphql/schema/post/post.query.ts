import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/lib/graphql/builder';
import { prisma } from '~/lib/prisma';
import { GetPostArgs } from './dto/args/get-post-args.dto';
import { GetPostsByUserArgs } from './dto/args/get-posts-by-user-args.dto';

builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      args: t.arg({
        type: GetPostArgs,
        required: true,
      }),
    },
    resolve: async (query, _, { args }) => {
      const { id: rawId } = decodeGlobalID(args.id);
      return await prisma.post.findUnique({
        ...query,
        where: { id: rawId },
      });
    },
  }),
);

builder.queryField('posts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query) => prisma.post.findMany({ ...query }),
    totalCount: () => prisma.post.count(),
  }),
);

builder.queryField('postsByUser', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    args: {
      args: t.arg({
        type: GetPostsByUserArgs,
        required: true,
      }),
    },
    resolve: (query, _, { args }) => {
      return prisma.post.findMany({ where: { authorId: args.userId }, ...query });
    },
    totalCount: () => prisma.post.count(),
  }),
);

export const loadPostQuery = () => {
  console.log('Post query loaded');
};
