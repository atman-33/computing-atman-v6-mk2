import { builder } from '~/lib/graphql/builder';

builder.prismaObject('Tag', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    image: t.exposeString('image'),
  }),
});

export const loadTagModel = () => {
  console.log('Tag model loaded');
};
