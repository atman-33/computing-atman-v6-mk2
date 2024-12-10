import { ValueObject } from './abstractions/value-object';

export class Status extends ValueObject<string, 'Status'> {
  public static readonly DRAFT = 'DRAFT';
  public static readonly PUBLIC = 'PUBLIC';

  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    const validValues = [Status.DRAFT, Status.PUBLIC];
    if (!validValues.includes(value)) {
      throw new Error('ステータスは DRAFT or PUBLIC を指定してください。');
    }
  }
}
