import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/shadcn/ui/alert-dialog';

interface OkCancelDialogProps {
  /** アラートダイアログのトリガー */
  children?: React.ReactNode;
  title?: string;
  /**
   * 説明用のメッセージ。配列の要素ごとに改行される。
   */
  descriptions: string[];
  okText?: string;
  cancelText?: string;
  clickHandler: () => void;
}

const OkCancelDialog = (props: OkCancelDialogProps) => {
  const [open, setOpen] = useState(false);

  const { title, descriptions, children, okText, cancelText, clickHandler } = props;

  const handleOkClick = () => {
    if (clickHandler) {
      clickHandler();
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? ''}</AlertDialogTitle>
          <AlertDialogDescription>
            {descriptions.map((description, i) => (
              <div key={i}>{description}</div>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-w-[80px] rounded-full">
            {cancelText ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            className="min-w-[80px] rounded-full bg-blue-500 text-white shadow hover:bg-blue-700"
            onClick={handleOkClick}
          >
            {okText ?? 'OK'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { OkCancelDialog };
