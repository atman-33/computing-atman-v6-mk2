import { builder } from '../../builder';

builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name'),
    email: t.exposeString('email', {
      // authScopes: { loggedIn: true },
    }),
    posts: t.relatedConnection('Post', {
      cursor: 'id',
      totalCount: true,
    }),
  }),
});
