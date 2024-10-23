import { loadPostModel } from './post.model';
import { loadPostMutation } from './post.mutation';
import { loadPostQuery } from './post.query';

export const loadPost = () => {
  loadPostModel();
  loadPostMutation();
  loadPostQuery();
};
