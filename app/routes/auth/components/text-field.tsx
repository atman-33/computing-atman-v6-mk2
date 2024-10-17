import { ComponentProps, FC } from 'react';
import { useField } from 'remix-validated-form';
import { Input } from '~/components/shadcn/ui/input';
import { Label } from '~/components/shadcn/ui/label';

type TextFieldProps = Readonly<{
  htmlFor: string;
  label: string;
  type?: ComponentProps<'input'>['type'];
  errorMessage?: string;
}>;

export const TextField: FC<TextFieldProps> = ({ htmlFor, label, type, errorMessage }) => {
  // NOTE: useFieldはValidatedForm内でのみ利用可能
  const { error } = useField(htmlFor);

  return (
    <div className="flex w-full flex-col">
      <Label>{label}</Label>
      <Input
        type={type}
        id={htmlFor}
        name={htmlFor}
        className={`my-2 w-full rounded-xl border border-gray-300 p-2 outline-none ${!!error && 'border-red-500'}`}
      />
      {error && <span className="mb-2 text-red-500">{error}</span>}
      {errorMessage && <span className="mb-2 text-red-500">{errorMessage}</span>}
    </div>
  );
};
