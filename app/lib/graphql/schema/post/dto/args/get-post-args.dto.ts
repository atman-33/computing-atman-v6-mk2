import { builder } from '~/lib/graphql/builder';

export const GetPostArgs = builder.inputType('GetPostArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
