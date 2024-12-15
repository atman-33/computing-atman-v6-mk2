import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

const CustomToaster = () => {
  return (
    <Toaster
      toastOptions={{
        classNames: {
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-white group-[.toast]:text-black',
          error:
            'group toast group-[.toaster]:border-0 group-[.toaster]:bg-red-100 group-[.toaster]:text-red-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
          success:
            'group toast group-[.toaster]:border-0 group-[.toaster]:bg-green-100 group-[.toaster]:text-green-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
          warning:
            'group toast group-[.toaster]:border-0 group-[.toaster]:bg-yellow-100 group-[.toaster]:text-yellow-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
          info: 'group toast group-[.toaster]:border-0 group-[.toaster]:bg-gray-100 group-[.toaster]:text-gray-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
        },
      }}
    />
  );
};

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

const toastError = (message: string, duration?: number, position?: Position) => {
  toast.error(message, {
    duration: duration ?? 2000,
    position: position ?? 'bottom-center',
  });
};

const toastSuccess = (message: string, duration?: number, position?: Position) => {
  toast.success(message, {
    duration: duration ?? 2000,
    position: position ?? 'bottom-center',
  });
};

const toastWarning = (message: string, duration?: number, position?: Position) => {
  toast.warning(message, {
    duration: duration ?? 2000,
    position: position ?? 'bottom-center',
  });
};

const toastInfo = (message: string, duration?: number, position?: Position) => {
  toast.info(message, {
    duration: duration ?? 2000,
    position: position ?? 'bottom-center',
  });
};

export { CustomToaster, toastError, toastInfo, toastSuccess, toastWarning };
