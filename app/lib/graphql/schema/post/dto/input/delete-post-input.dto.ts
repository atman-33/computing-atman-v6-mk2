import { builder } from '~/lib/graphql/builder';

export const DeletePostInput = builder.inputType('DeletePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
