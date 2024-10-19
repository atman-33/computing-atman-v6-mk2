import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/lib/graphql/builder';
import { prisma } from '~/lib/prisma';
import { GetTagArgs } from './dto/args/get-tag-args.dto';

builder.queryField('tag', (t) =>
  t.prismaField({
    type: 'Tag',
    nullable: true,
    args: {
      args: t.arg({
        type: GetTagArgs,
        required: true,
      }),
    },
    resolve: async (query, _, { args }) => {
      const { id: rawId } = decodeGlobalID(args.id);
      return await prisma.tag.findUnique({
        ...query,
        where: { id: rawId },
      });
    },
  }),
);

builder.queryField('tags', (t) =>
  t.prismaField({
    type: ['Tag'],
    nullable: true,
    resolve: async (query) => await prisma.tag.findMany({ ...query }),
  }),
);
