import { builder } from '~/lib/graphql/builder';

export const UpdateTagInput = builder.inputType('UpdateTagInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string({ required: true }),
    image: t.string({ required: false }),
  }),
});
