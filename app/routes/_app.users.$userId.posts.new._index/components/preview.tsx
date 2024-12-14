import '~/lib/shiki-transformers/transformer-add-copy-button.css';
import './preview.css';

import { ClientOnly } from '~/components/shared/client-only';
import { useMarkdownValueStore } from '../stores/markdown-value-store';

interface PreviewProps {
  className?: string;
}

export const Preview = ({ className }: PreviewProps) => {
  const sanitizedHtml = useMarkdownValueStore((state) => state.sanitizedHtml);

  return (
    <ClientOnly>
      {() => (
        <div
          className={`preview h-full overflow-y-auto rounded-md border px-3 py-2 ${className}`}
          dangerouslySetInnerHTML={{
            __html: sanitizedHtml,
          }}
        ></div>
      )}
    </ClientOnly>
  );
};
