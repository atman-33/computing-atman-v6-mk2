import { ValueObject } from './abstractions/value-object';

export class Emoji extends ValueObject<string, 'Emoji'> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (Array.from(value).length > 1) {
      throw new Error('絵文字は1文字にしてください。');
    }
  }
}
