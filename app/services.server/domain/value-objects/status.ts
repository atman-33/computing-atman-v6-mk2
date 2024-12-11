import { PostStatus } from '~/lib/graphql/@generated/graphql';
import { ValueObject } from './abstractions/value-object';

export class Status extends ValueObject<PostStatus, 'Status'> {
  constructor(value: PostStatus) {
    super(value);
  }

  protected validate(value: PostStatus): void {
    const validValues = [PostStatus.Draft, PostStatus.Public];
    if (!validValues.includes(value)) {
      throw new Error('ステータスは DRAFT or PUBLIC を指定してください。');
    }
  }
}
