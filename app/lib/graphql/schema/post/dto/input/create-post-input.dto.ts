import { builder } from '~/lib/graphql/builder';
import { PostStatus } from '../../post.model';

export const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    emoji: t.string({ required: true }),
    content: t.string({ required: true }),
    status: t.field({ type: PostStatus, required: true }),
    tagIds: t.stringList({ required: false }),
  }),
});
