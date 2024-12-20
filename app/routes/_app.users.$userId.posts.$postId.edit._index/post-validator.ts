import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';

const PostFormSchema = z.object({
  emoji: z
    .string()
    .refine((emoji: string) => Array.from(emoji).length === 1, '絵文字は1文字で入力してください'),
  title: z
    .string()
    .min(1, 'タイトルは1文字以上で入力してください')
    .max(100, 'タイトルは100文字以下で入力してください'),
});

export const postValidator = withZod(PostFormSchema);
