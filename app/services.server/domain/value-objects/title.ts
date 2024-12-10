import { ValueObject } from './abstractions/value-object';

export class Title extends ValueObject<string, 'Title'> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (value.length > 200) {
      throw new Error('記事のタイトルは200文字以下にしてください。');
    }
  }
}
