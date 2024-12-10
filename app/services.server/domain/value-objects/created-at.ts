import { isDate } from 'util/types';
import { ValueObject } from './abstractions/value-object';

export class CreatedAt extends ValueObject<Date, 'CreatedAt'> {
  constructor(value: Date) {
    super(value);
  }

  protected validate(value: Date): void {
    if (!isDate(value)) {
      throw new Error('CreatedAt must be a Date.');
    }
  }
}
