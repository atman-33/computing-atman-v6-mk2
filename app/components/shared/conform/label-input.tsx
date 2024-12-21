import { FieldMetadata, getInputProps } from '@conform-to/react';
import { Input } from '~/components/shadcn/ui/input';
import { Label } from '~/components/shadcn/ui/label';

interface LabelInputProps<Schema> {
  metadata: FieldMetadata<Schema>;
  options: {
    type:
      | 'number'
      | 'search'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      | 'month'
      | 'password'
      | 'range'
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week';
    value?: boolean | undefined;
  };
  label: string;
  placeholder?: string;
}

/**
 * Conformに対応したラベル付きインプット
 * @param param0
 * @returns
 */
const LabelInput = <Schema,>({
  metadata,
  options,
  label,
  placeholder,
}: LabelInputProps<Schema>) => {
  const inputProps = getInputProps(metadata, options);
  return (
    <div className="flex w-full flex-col">
      <Label htmlFor={inputProps.id}>{label}</Label>
      <Input
        {...inputProps}
        placeholder={placeholder}
        className={`my-2 w-full rounded-xl border border-gray-300 p-2 outline-none ${!!metadata.errors && 'border-red-500'}`}
      />
      {metadata.errors && (
        <div>
          {metadata.errors.map((e, index) => (
            <p key={index} className="mb-2 text-red-500">
              {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabelInput;
