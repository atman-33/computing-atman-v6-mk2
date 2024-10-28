import 'easymde/dist/easymde.min.css';
import './md-editor.css';

import { marked } from 'marked';
import React, { lazy, Suspense, useEffect, useState } from 'react';

// NOTE: RemixはSSRのため、CSR用コンポーネントはdynamic importする必要あり
const SimpleMde = lazy(async () => {
  const module = await import('react-simplemde-editor');
  return { default: module.default };
});
const MemoizedMed = React.memo(SimpleMde);

const MarkdownEditorPage = () => {
  const [markdownValue, setMarkdownValue] = useState('Initial value');
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    // NOTE: DOMPurifyはブラウザ環境向けのため、useEffect内のクライアントサイドで実行する
    if (typeof window !== 'undefined') {
      import('dompurify').then((DOMPurify) => {
        const markedValue = marked.parse(markdownValue) as string;
        setPreviewHtml(DOMPurify.default.sanitize(markedValue));
      });
    }
  }, [markdownValue]);

  const handleMarkdownChange = (value: string) => {
    setMarkdownValue(value);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MemoizedMed value={markdownValue} onChange={handleMarkdownChange} />
        <div>
          <h2>Preview</h2>
          <div
            className="min-h-24 rounded-s border-2 p-4"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </Suspense>
    </>
  );
};

export default MarkdownEditorPage;
