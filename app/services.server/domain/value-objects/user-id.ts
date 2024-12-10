import { ValueObject } from './abstractions/value-object';

export class UserId extends ValueObject<string, 'UserId'> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (value.length > 24) {
      throw new Error('ユーザーIDは24文字以下にしてください。');
    }
  }
}
