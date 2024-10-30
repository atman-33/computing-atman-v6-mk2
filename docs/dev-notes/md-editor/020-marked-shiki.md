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
  themes: ['nord', 'github-dark', 'github-light'],
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

**上記のhighlighterはトップレベルでawaitを利用しているため、Viteでbuildするとエラーとなる。**そのため、下記のようにvite configを設定しておく。  

`vite.config.ts`

```ts
// ...
export default ({ mode }: { mode: string }) => {
  // ...
  return defineConfig({
    // ...
    esbuild: {
      supported: {
        'top-level-await': true,
      },
    },
  });
};

```

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

### コードのdiff表示などtransformersを適用

ライブラリをインストールする。  

```sh
npm i -D @shikijs/transformers
```

`app/routes/_.poc.md-editor._index/route.tsx`

```tsx
import 'easymde/dist/easymde.min.css';
import './md-editor.css';

import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { highlighter } from '~/lib/highlighter';

// NOTE: RemixはSSRのため、CSR用コンポーネントはdynamic importする必要あり
const SimpleMde = lazy(async () => {
  const module = await import('react-simplemde-editor');
  return { default: module.default };
});
const MemoizedMed = React.memo(SimpleMde);

const MarkdownEditorPage = () => {
  const marked = useMemo(
    () =>
      new Marked(
        {
          gfm: true,
          breaks: true,
        },
        markedHighlight({
          highlight(code, lang) {
            // console.log(`lang: ${lang}`);
            const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'plaintext';
            return highlighter.codeToHtml(code, {
              lang: language,
              theme: 'github-dark',
              transformers: [
                transformerNotationDiff(),
                transformerNotationHighlight(),
                transformerNotationFocus(),
              ],
            });
          },
        }),
      ),
    [],
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
  }, [markdownValue, marked]);

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

- `new Marked(...`内で、transformersを追加
- 下記をコメントアウトに記載することでハイライトを変更することができる。
  - // [!code ++]
  - // [!code --]
  - // [!code highlight]
  - // [!code focus]

### ハイライトが適用されるようにCSS設定を追加

`app/routes/_.poc.md-editor._index/md-editor.css`

```css
/* コードブロック */
code > pre {
  padding: 1em 1.2em;
  overflow-x: auto;
  border-radius: 8px;
  margin: 1em 0;
}
/* コードブロック - shiki transformers - */
.line {
  display: inline;
  padding-bottom: 0;
}
.diff {
  display: inline-block;
  width: 100%;
}
.diff.add {
  background-color: #0505;
}
.diff.add::before {
  content: '+';
  color: green;
  margin-right: 8px; /* +とテキストの間のスペース調整 */
}
.diff.remove {
  background-color: #8005;
}
.diff.remove::before {
  content: '-';
  color: red;
  margin-right: 8px; /* -とテキストの間のスペース調整 */
}
.highlighted {
  display: inline-block;
  width: 100%;
  background-color: #555;
}
.diff:before {
  position: absolute;
  left: 40px;
}
.has-focused .line {
  filter: blur(0.095rem);
}
.has-focused .focused {
  filter: blur(0);
}
```
