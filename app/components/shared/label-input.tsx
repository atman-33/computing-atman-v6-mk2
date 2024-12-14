import { Input } from '../shadcn/ui/input';
import { Label } from '../shadcn/ui/label';

interface LabelInputProps {
  label: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id?: string;
  name?: string;
  placeholder?: string;
}

export const LabelInput = ({ label, className, type, id, placeholder, name }: LabelInputProps) => {
  return (
    <div className={`flex flex-col gap-y-1.5 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} id={id} name={name ?? id} placeholder={placeholder} />
    </div>
  );
};
