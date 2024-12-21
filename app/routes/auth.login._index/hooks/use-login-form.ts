import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useEffect } from 'react';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須入力です' })
    .email('メールアドレスを正しい形式で入力してください')
    .max(128, 'メールアドレスは128文字以下で入力してください'),
  password: z
    .string({ required_error: 'パスワードは必須入力です' })
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以下で入力してください')
    .refine(
      (password: string) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      'パスワードは半角英数字の両方を含めてください',
    ),
});

const useLoginForm = () => {
  const form = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginFormSchema });
    },
  });

  useEffect(() => {
    form[0].reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return form;
};

export { useLoginForm };