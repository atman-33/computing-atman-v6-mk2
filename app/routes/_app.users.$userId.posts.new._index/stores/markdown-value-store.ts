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

type MarkdownValueStore = {
  markdownValue: string;
  setMarkdownValue: (value: string) => void;
  sanitizedHtml: string;
  parseMarkdown: () => void;
};

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
          ],
        });
      },
    }),
  );

  return {
    markdownValue: '',
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
