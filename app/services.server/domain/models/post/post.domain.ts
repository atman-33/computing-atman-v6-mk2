import { Content } from '../../value-objects/content';
import { Emoji } from '../../value-objects/emoji';
import { PostId } from '../../value-objects/post-id';
import { Status } from '../../value-objects/status';
import { Title } from '../../value-objects/title';
import { UserId } from '../../value-objects/user-id';

export class PostDomain {
  private constructor(
    private readonly _id: PostId,
    private _title: Title,
    private _emoji: Emoji,
    private _content: Content,
    private _status: Status,
    private _authorId: UserId,
  ) {}

  public get id(): PostId {
    return this._id;
  }

  public get title(): Title {
    return this._title;
  }

  public get emoji(): Emoji {
    return this._emoji;
  }

  public get content(): Content {
    return this._content;
  }

  public get status(): Status {
    return this._status;
  }

  public get authorId(): UserId {
    return this._authorId;
  }

  public static create(
    title: Title,
    emoji: Emoji,
    content: Content,
    status: Status,
    authorId: UserId,
  ): PostDomain {
    return new PostDomain(new PostId(), title, emoji, content, status, authorId);
  }

  public static reconstruct(
    id: PostId,
    title: Title,
    emoji: Emoji,
    content: Content,
    status: Status,
    authorId: UserId,
  ) {
    return new PostDomain(id, title, emoji, content, status, authorId);
  }
}
