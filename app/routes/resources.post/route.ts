import { ActionFunctionArgs, json } from '@remix-run/node';
import { deletePost } from '~/services/post/delete-post';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const action = form.get('_action') as 'delete';
  const postId = form.get('postId') as string;

  switch (action) {
    case 'delete': {
      const data = await deletePost({ id: postId }, request);
      return json(data);
    }
    default: {
      throw new Error('_actionの設定ミスです!');
    }
  }
};
