import { describe, expect, test } from 'vitest';
import { PostId } from './post-id';

describe('post-id', () => {
  test('生成_nullで生成可能なこと', () => {
    // Arrange
    // Act
    const vo = new PostId();
    // Assert
    expect(vo.value).toBeNull();
  });

  test('生成_24文字を超える値は例外が発生すること', () => {
    // Arrange
    const id = 'a'.repeat(25);
    // Act
    // Assert
    expect(() => {
      new PostId(id);
    }).toThrow('PostIdは24文字以下にしてください。');
  });
});
