# マークダウンエディタ実装

> 追記:  
> CSR用コンポーネントをdynamic importしているが、ClientOnlyコンポーネントを利用すれば通常通り記述可能

```tsx
import * as React from 'react';
import { useSyncExternalStore } from 'react';

const subscribe = () => {
  return () => {};
};

const useHydrated = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
};

interface Props {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render the children only after the JS has loaded client-side. Use an optional
 * fallback component if the JS is not yet loaded.
 *
 * Example: Render a Chart component if JS loads, renders a simple FakeChart
 * component server-side or if there is no JS. The FakeChart can have only the
 * UI without the behavior or be a loading spinner or skeleton.
 * ```tsx
 * return (
 *   <ClientOnly fallback={<FakeChart />}>
 *     {() => <Chart />}
 *   </ClientOnly>
 * );
 * ```
 * @param children - A function that returns a React node to be rendered after hydration
 * @param fallback - A React node to be rendered as a fallback until hydration occurs
 * @returns A React node that is either the children or the fallback based on hydration status
 */
export const ClientOnly = ({ children, fallback = null }: Props) => {
  const isHydrated = useHydrated();

  return isHydrated ? <>{children()}</> : <>{fallback}</>;
};
```

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
