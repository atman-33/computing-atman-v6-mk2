import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/lib/graphql/builder';
import { prisma } from '~/lib/prisma';
import { CreatePostInput } from './dto/input/create-post-input.dto';
import { DeletePostInput } from './dto/input/delete-post-input.dto';
import { UpdatePostInput } from './dto/input/update-post-input.dto';

builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: false,
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      validate(input);

      const createdPost = await prisma.post.create({
        ...query,
        data: {
          title: input.title,
          emoji: input.emoji,
          content: input.content,
          status: input.status,
          authorId: ctx.user.id,
        },
      });

      if (input.tagIds && input.tagIds.length > 0) {
        const postTagsData = input.tagIds.map((tagId) => ({
          postId: createdPost.id,
          tagId,
        }));

        await prisma.postTag.createMany({
          data: postTagsData,
        });
      }

      return createdPost;
    },
  }),
);

builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      input: t.arg({
        type: UpdatePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }) => {
      validate(input);

      const { id: rawId } = decodeGlobalID(input.id);
      const updatedPost = await prisma.post.update({
        ...query,
        where: {
          id: rawId,
        },
        data: {
          title: input.title,
          emoji: input.emoji,
          content: input.content,
          status: input.status,
        },
      });

      if (input.tagIds) {
        await prisma.postTag.deleteMany({
          where: {
            postId: rawId,
          },
        });

        if (input.tagIds.length > 0) {
          const postTagsData = input.tagIds.map((tagId) => ({
            postId: rawId,
            tagId,
          }));

          await prisma.postTag.createMany({
            data: postTagsData,
          });
        }
      }

      return updatedPost;
    },
  }),
);

builder.mutationField('deletePost', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      input: t.arg({
        type: DeletePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return await prisma.post.delete({
        ...query,
        where: { id: rawId },
      });
    },
  }),
);

const validate = (input: { title?: string; emoji?: string }) => {
  if (input.title && input.title.length > 100) {
    throw new Error('タイトルは100文字以内にしてください。');
  }

  if (input.emoji && Array.from(input.emoji).length > 1) {
    throw new Error('絵文字は1文字以内にしてください。');
  }
};

export const loadPostMutation = () => {
  console.log('Post mutation loaded');
};
