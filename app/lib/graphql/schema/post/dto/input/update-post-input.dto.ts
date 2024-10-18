import { builder } from '~/lib/graphql/builder';
import { PostStatus } from '../../post.node';

export const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    title: t.string({ required: true }),
    emoji: t.string({ required: true }),
    content: t.string({ required: true }),
    status: t.field({ type: PostStatus, required: true }),
    tagIds: t.stringList({ required: false }),
  }),
});
