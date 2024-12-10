import { isDate } from 'util/types';
import { ValueObject } from './abstractions/value-object';

export class UpdatedAt extends ValueObject<Date, 'UpdatedAt'> {
  constructor(value: Date) {
    super(value);
  }

  protected validate(value: Date): void {
    if (!isDate(value)) {
      throw new Error('UpdatedAt must be a Date.');
    }
  }
}
