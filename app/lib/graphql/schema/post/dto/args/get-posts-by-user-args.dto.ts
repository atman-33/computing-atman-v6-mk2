import { builder } from '~/lib/graphql/builder';

export const GetPostsByUserArgs = builder.inputType('GetPostsByUserArgs', {
  fields: (t) => ({
    userId: t.string({ required: true }),
  }),
});
