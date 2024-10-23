import { loadTagModel } from './tag.model';
import { loadTagMutation } from './tag.mutation';
import { loadTagQuery } from './tag.query';

export const loadTag = () => {
  loadTagModel();
  loadTagMutation();
  loadTagQuery();
};
