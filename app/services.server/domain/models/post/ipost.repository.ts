import { PostDomain } from './post.domain';

export interface IPostRespository {
  create(post: PostDomain): Promise<PostDomain>;
}
