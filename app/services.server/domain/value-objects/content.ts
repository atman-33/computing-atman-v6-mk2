import { ValueObject } from './abstractions/value-object';

export class Content extends ValueObject<string, 'Content'> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (value.length > 100000) {
      throw new Error('記事の内容は100,000文字以下にしてください。');
    }
  }
}
