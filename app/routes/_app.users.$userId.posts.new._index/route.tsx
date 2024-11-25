import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { useMemo } from 'react';
import { SimpleTabsList, SimpleTabsTrigger } from '~/components/shadcn/custom/simple-tabs';
import { Label } from '~/components/shadcn/ui/label';
import { Tabs, TabsContent } from '~/components/shadcn/ui/tabs';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { ClientOnly } from '~/components/shared/client-only';
import { LabelInput } from '~/components/shared/label-input';
import { highlighter } from '~/lib/highlighter';
import { useMarkdownValueStore } from './stores/markdown-value-store';

// TODO: マークダウンのプレビュー画面を追加

const PostNewPage = () => {
  const { markdownValue, setMarkdownValue } = useMarkdownValueStore();

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

  return (
    <>
      <div className="flex h-[120dvh] flex-col gap-4">
        <LabelInput label="絵文字 *" id="emoji" placeholder="" type="text" />
        <LabelInput label="タイトル *" id="title" placeholder="" type="text" />
        <div className="flex grow flex-col gap-1.5">
          <div>
            <Label>内容 *</Label>
            <span className="text-sm">{' マークダウンで記載してください。'}</span>
          </div>

          <Tabs defaultValue="code" className="h-full">
            <SimpleTabsList>
              <SimpleTabsTrigger value="code">コード</SimpleTabsTrigger>
              <SimpleTabsTrigger value="preview">プレビュー</SimpleTabsTrigger>
            </SimpleTabsList>
            {/* NOTE: TabsContentの高さを減らす場合はここを調整 e.g. h-5/6 etc. */}
            <TabsContent value="code" className="h-full">
              <Textarea
                className="h-full"
                value={markdownValue}
                onChange={(e) => setMarkdownValue(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="preview">
              <ClientOnly>
                {() => (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(marked.parse(markdownValue) as string),
                    }}
                  ></div>
                )}
              </ClientOnly>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PostNewPage;
