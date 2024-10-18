import { builder } from '~/lib/graphql/builder';

export const DeleteTagInput = builder.inputType('DeleteTagInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
