import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { highlighter } from '~/lib/highlighter';
import { transformerAddCopyButton } from '~/lib/shiki-transformers/transformer-add-copy-button';

// NOTE:
// store側では、getMarked()でインスタンス化したMarkedを扱うこと。
// 仮に、const marked = new Marked(...) とした場合のmarkedを扱うと、transformersの処理が画面に反映されないため。

/**
 * Creates and returns a configured instance of the `Marked` class.
 *
 * The instance is configured with GitHub Flavored Markdown (GFM) and line breaks enabled.
 * It also uses a custom highlight function to syntax highlight code blocks.
 *
 * The highlight function uses a highlighter to convert code to HTML, applying the 'github-dark' theme.
 * It also includes several transformers for additional functionality:
 * - `transformerNotationDiff()`: Handles diff notation.
 * - `transformerNotationHighlight()`: Handles highlight notation.
 * - `transformerNotationFocus()`: Handles focus notation.
 * - `transformerAddCopyButton()`: Adds a copy button to code blocks.
 *
 * @returns {Marked} A configured instance of the `Marked` class.
 */
const getMarked = () => {
  return new Marked(
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
};

export { getMarked };
