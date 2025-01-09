import '~/lib/shiki-transformers/transformer-add-copy-button.css';
import './preview.css';

import { ClientOnly } from '~/components/shared/client-only';
import { useEditPostStore } from '../stores/edit-post-store';

interface PreviewProps {
  className?: string;
}

export const Preview = ({ className }: PreviewProps) => {
  const contentHtml = useEditPostStore((state) => state.contentHtml);

  return (
    <ClientOnly>
      {() => (
        <div
          className={`preview h-full overflow-y-auto rounded-md border px-3 py-2 ${className}`}
          dangerouslySetInnerHTML={{
            __html: contentHtml,
          }}
        ></div>
      )}
    </ClientOnly>
  );
};
