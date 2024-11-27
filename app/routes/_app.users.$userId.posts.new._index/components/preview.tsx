import { ClientOnly } from '~/components/shared/client-only';
import { useMarkdownValueStore } from '../stores/markdown-value-store';

export const Preview = () => {
  const sanitizedHtml = useMarkdownValueStore((state) => state.sanitizedHtml);

  return (
    <ClientOnly>
      {() => (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedHtml,
          }}
        ></div>
      )}
    </ClientOnly>
  );
};
