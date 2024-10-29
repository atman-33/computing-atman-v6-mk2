# マークダウンにshiki（シンタックスハイライト）を適用する方法

## 参考URL

- [marked-highlight](https://www.npmjs.com/package/marked-highlight)
- [Shiki 式 yntax highlighter](https://shiki.matsu.io/)
- [シンタックスハイライター`Shiki`の紹介](https://zenn.dev/funteractiveinc/articles/4ed268557a4796#transformers)

## ステップ

### ライブラリをインストール

```sh
npm i -D shiki
npm i marked-highlight
```

### highlighterを準備

`app/lib/highlighter.ts`

```ts
import { createHighlighter } from 'shiki';

export const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [
    'plaintext',
    'text',
    'txt',
    'csv',
    'sh',
    'shell',
    'powershell',
    'bat',
    'html',
    'xml',
    'css',
    'sql',
    'graphql',
    'javascript',
    'typescript',
    'js',
    'jsx',
    'ts',
    'tsx',
    'csharp',
    'cs',
    'vb',
  ],
});
```

- アプリ内で利用するテーマやプログラミング言語は、このhighlighterで予め定義しておく。
- マークダウンからHtmlに変換する際、ここで定義したテーマや言語から選択して適用する。

### Markedにshiki（シンタックスハイライト）を適用

`app/routes/_.poc.md-editor._index/route.tsx`

```tsx
import 'easymde/dist/easymde.min.css';
import './md-editor.css';

import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { highlighter } from '~/lib/highlighter';

// NOTE: RemixはSSRのため、CSR用コンポーネントはdynamic importする必要あり
const SimpleMde = lazy(async () => {
  const module = await import('react-simplemde-editor');
  return { default: module.default };
});
const MemoizedMed = React.memo(SimpleMde);

const MarkdownEditorPage = () => {
  const marked = new Marked(
    {
      gfm: true,
      breaks: true,
    },
    markedHighlight({
      highlight(code, lang) {
        // console.log(`lang: ${lang}`);
        const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'plaintext';
        return highlighter.codeToHtml(code, { lang: language, theme: 'github-dark' });
      },
    }),
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

- `new Marked(...`でマークダウン変換用のインスタンスを生成する際に、ハイライト変換を仕込んでおく（`marked-highlight`ライブラリを利用）。
