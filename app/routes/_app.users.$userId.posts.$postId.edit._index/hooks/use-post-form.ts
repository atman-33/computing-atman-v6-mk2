import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useEffect } from 'react';
import { z } from 'zod';

const PostFormSchema = z.object({
  emoji: z
    .string({ required_error: '絵文字は必須入力です' })
    .refine((emoji: string) => Array.from(emoji).length === 1, '絵文字は1文字で入力してください'),
  title: z
    .string({ required_error: 'タイトルは必須入力です' })
    .min(1, 'タイトルは1文字以上で入力してください')
    .max(100, 'タイトルは100文字以下で入力してください'),
});

const usePostForm = () => {
  const form = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostFormSchema });
    },
  });

  useEffect(() => {
    form[0].reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return form;
};

export { usePostForm };
