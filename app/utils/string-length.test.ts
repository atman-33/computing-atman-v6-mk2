import { describe, expect, test } from 'vitest';
import { getEmojiLength } from './string-length';

describe('string-length', () => {
  test('絵文字1文字の文字数を正しくカウントできること', () => {
    // Arrange
    const emoji = '😌';
    // Act
    // console.log('emoji.length => ', emoji.length); // return 2 (not 1)
    const length = getEmojiLength(emoji);
    // Assert
    expect(length).toBe(1);
  });
});
