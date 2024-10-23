import { builder } from '../builder';
import { loadPost } from './post';
import { loadTag } from './tag';
import { loadUser } from './user';

// 各スキーマを読み込み
loadPost();
loadTag();
loadUser();

export const schema = builder.toSchema();
