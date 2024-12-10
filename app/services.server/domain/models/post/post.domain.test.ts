import { describe, expect, test } from 'vitest';
import { Content } from '../../value-objects/content';
import { Emoji } from '../../value-objects/emoji';
import { PostId } from '../../value-objects/post-id';
import { Status } from '../../value-objects/status';
import { Title } from '../../value-objects/title';
import { UserId } from '../../value-objects/user-id';
import { PostDomain } from './post.domain';

describe('post.domain', () => {
  test('生成_createで生成できること', () => {
    // Arrange
    const title = new Title('Title');
    const emoji = new Emoji('Emoji');
    const content = new Content('# Content');
    const status = new Status('DRAFT');
    const authorId = new UserId('65c9f1e3b68e5c001234abcd');

    // Act
    const post = PostDomain.create(title, emoji, content, status, authorId);

    // Assert
    expect(post.id.value).toBeNull();
    expect(post.title.value).toBe('Title');
  });

  test('生成_reconstructでは指定したidで生成されること', () => {
    // Arrange
    const id = new PostId('75c9f1e3b68e5c001234abcd');
    const title = new Title('Title');
    const emoji = new Emoji('Emoji');
    const content = new Content('# Content');
    const status = new Status('DRAFT');
    const authorId = new UserId('65c9f1e3b68e5c001234abcd');

    // Act
    const post = PostDomain.reconstruct(id, title, emoji, content, status, authorId);

    // Assert
    expect(post.id.value).toBe('75c9f1e3b68e5c001234abcd');
    expect(post.title.value).toBe('Title');
  });
});
