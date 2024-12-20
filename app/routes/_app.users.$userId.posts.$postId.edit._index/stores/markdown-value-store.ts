import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { create } from 'zustand';
import { highlighter } from '~/lib/highlighter';
import { transformerAddCopyButton } from '~/lib/shiki-transformers/transformer-add-copy-button';

interface MarkdownValueStore {
  markdownValue: string;
  setMarkdownValue: (value: string) => void;
  sanitizedHtml: string;
  parseMarkdown: () => void;
}

export const useMarkdownValueStore = create<MarkdownValueStore>((set, get) => {
  // Marked インスタンスの初期化
  const marked = new Marked(
    {
      gfm: true,
      breaks: true,
    },
    markedHighlight({
      highlight(code, lang) {
        const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'plaintext';
        return highlighter.codeToHtml(code, {
          lang: language,
          theme: 'github-dark',
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationFocus(),
            transformerAddCopyButton(),
          ],
        });
      },
    }),
  );

  // TODO: 下記は開発用で設定しているため後で削除すること
  const _s = `

  # 見出し1

  これは例です。
  
  ## 見出し2
  
  ### 見出し3
  
  #### 見出し4
  
  ##### 見出し5
  
  ~~~ts
  const a = b;
  const b = c;
  ~~~
  
  強調: **abc**    
  イタリック: *abc*
  
  ソースファイル~route.ts~    
  
  [aaa](http://a)
  
  - a
  - b
  - c
  
  1. x
  2. x
  3. x
  
  ___
  
  > abcde
  
  | TH 左寄せ | TH 中央寄せ | TH 右寄せ |
  | :--- | :---: | ---: |
  | TD | TD | TD |
  | TD | TD | TD | 
`;

  return {
    // markdownValue: '',
    markdownValue: _s.replace(/~/g, '`'),
    sanitizedHtml: '',
    setMarkdownValue: (value) => {
      set((state) => ({ ...state, markdownValue: value }));
    },
    parseMarkdown: () => {
      const { markdownValue } = get();
      const rawHtml = marked.parse(markdownValue);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml as string);
      set((state) => ({ ...state, sanitizedHtml }));
    },
  };
});
