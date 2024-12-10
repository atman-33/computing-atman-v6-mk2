import { ValueObject } from './abstractions/value-object';

export class PostId extends ValueObject<string | null, 'PostId'> {
  constructor(value: string | null = null) {
    super(value);
  }

  protected validate(value: string): void {
    if (value !== null && value.length > 24) {
      throw new Error('PostIdは24文字以下にしてください。');
    }
  }
}
