import { describe, expect, test } from 'vitest';
import { PostDomain } from '~/services.server/domain/models/post/post.domain';
import { Content } from '~/services.server/domain/value-objects/content';
import { Emoji } from '~/services.server/domain/value-objects/emoji';
import { Status } from '~/services.server/domain/value-objects/status';
import { Title } from '~/services.server/domain/value-objects/title';
import { UserId } from '~/services.server/domain/value-objects/user-id';
import { GraphqlPostRepository } from './graphql-post.repository';

describe('graphql-post.repository', () => {
  test('登録_createが実装されていること', async () => {
    // Arrange
    const title = new Title('Title');
    const emoji = new Emoji('🚀');
    const content = new Content('# Content');
    const status = new Status('DRAFT');
    const authorId = new UserId('65c9f1e3b68e5c001234abcd');

    const post = PostDomain.create(title, emoji, content, status, authorId);

    // Act
    const repository = new GraphqlPostRepository();
    const result = await repository.create(post);

    // Assert
    expect(result.id).toBe('12345678');
  });
});
