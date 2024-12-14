import { describe, expect, test } from 'vitest';
import { formatDate } from './date-util';

describe('date-util', () => {
  test('正常系: 1月の日付を文字列に変換する。', () => {
    // NOTE: month は 0～11 で定義されているため注意
    const date = new Date(2012, 0, 1);

    const dateString = formatDate(date, '/');
    expect(dateString).toBe('2012/01/01');
  });

  test('正常系: 12月の日付を文字列に変換する。', () => {
    const date = new Date(2012, 11, 31);

    const dateString = formatDate(date, '/');
    expect(dateString).toBe('2012/12/31');
  });
});
