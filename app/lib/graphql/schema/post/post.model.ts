import { builder } from '~/lib/graphql/builder';

export const PostStatus = builder.enumType('PostStatus', {
  values: ['DRAFT', 'PUBLIC'] as const,
});

// NOTE: prismaNodeのPostで、tagのリレーションを利用するために必要
builder.prismaObject('PostTag', {
  fields: (t) => ({
    id: t.exposeString('id'),
    post: t.relation('post'),
    tag: t.relation('tag'),
  }),
});

builder.prismaNode('Post', {
  id: { field: 'id' },
  findUnique: (id) => ({ id }),
  fields: (t) => ({
    title: t.exposeString('title'),
    emoji: t.exposeString('emoji'),
    content: t.exposeString('content'),
    status: t.expose('status', { type: PostStatus }),
    author: t.relation('author'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    tags: t.relation('tags'),
  }),
});
