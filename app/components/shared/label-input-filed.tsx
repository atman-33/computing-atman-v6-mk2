import { ComponentProps, FC } from 'react';
import { useField } from 'remix-validated-form';
import { Input } from '~/components/shadcn/ui/input';
import { Label } from '~/components/shadcn/ui/label';

type TextFieldProps = Readonly<{
  name: string;
  label: string;
  type?: ComponentProps<'input'>['type'];
  placeholder?: string;
  errorMessage?: string;
}>;

/**
 * ValidatedFormのエラーメッセージに対応したラベル付きインプット
 * @param param0
 * @returns
 */
export const LabelInputField: FC<TextFieldProps> = ({
  name,
  label,
  type,
  placeholder,
  errorMessage,
}) => {
  // NOTE: useFieldはValidatedForm内でのみ利用可能
  const { error } = useField(name);

  return (
    <div className="flex w-full flex-col">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={`my-2 w-full rounded-xl border border-gray-300 p-2 outline-none ${!!error && 'border-red-500'}`}
      />
      {error && <span className="mb-2 text-red-500">{error}</span>}
      {errorMessage && <span className="mb-2 text-red-500">{errorMessage}</span>}
    </div>
  );
};
