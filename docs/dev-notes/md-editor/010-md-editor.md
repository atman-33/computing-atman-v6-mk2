# マークダウンエディタ実装

## 参考URL

- [Reactでマークダウンエディタを作ってみよう](https://zenn.dev/rinka/articles/b260e200cb5258)
- [https://stackoverflow.com/questions/75706454/how-to-render-component-only-client-side-with-remix](https://stackoverflow.com/questions/75706454/how-to-render-component-only-client-side-with-remix)

## ステップ

### ライブラリをインストール

```sh
npm i react-simplemde-editor easymde marked dompurify
npm i -D @types/dompurify
```

- marked（GitHub）: これはマークダウン形式の文字列をHTMLに変換してくれます。
- DOMPurify（GitHub）: これはHTMLをサニタイズし、XSS攻撃を防いでくれます。
- highlight.js（GitHub）: これはコードを挿入している部分にハイライトをつけてくれます。

### 基本的なエディタの実装

`app/routes/__.poc.md-editor._index/route.tsx`

```tsx
import 'easymde/dist/easymde.min.css';
import React, { lazy, Suspense, useState } from 'react';

// NOTE: RemixはSSRのため、CSR用コンポーネントはdynamic importする必要あり
const SimpleMde = lazy(async () => {
  const module = await import('react-simplemde-editor');
  return { default: module.default };
});
const MemoizedMed = React.memo(SimpleMde);

const MarkDownEditorPage = () => {
  const [markdownValue, setMarkdownValue] = useState('Initial value');

  const handleMarkdownChange = (value: string) => {
    setMarkdownValue(value);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MemoizedMed value={markdownValue} onChange={handleMarkdownChange} />
      </Suspense>
    </>
  );
};

export default MarkDownEditorPage;
```

### プレビュー機能を追加

`app/routes/__.poc.md-editor._index/route.tsx`

```tsx
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
```

- DOMPurifyはブラウザ環境向けのため、useEffect内のクライアントサイドで実行することに注意
