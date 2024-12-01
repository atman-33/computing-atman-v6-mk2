import { useEffect } from 'react';
import { SimpleTabsList, SimpleTabsTrigger } from '~/components/shadcn/custom/simple-tabs';
import { Label } from '~/components/shadcn/ui/label';
import { Tabs, TabsContent } from '~/components/shadcn/ui/tabs';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { LabelInput } from '~/components/shared/label-input';
import { Preview } from './components/preview';
import { useMarkdownValueStore } from './stores/markdown-value-store';

// TODO: マークダウンのプレビュー画面を追加

const PostNewPage = () => {
  const { markdownValue, setMarkdownValue, parseMarkdown } = useMarkdownValueStore();

  useEffect(() => {
    parseMarkdown();
  }, [parseMarkdown]);

  const handleTextareaChange = (code: string) => {
    setMarkdownValue(code);
    parseMarkdown();
  };

  const handlePreviewClick = () => {
    // NOTE: タブ切替後はparseMarkdown()を呼び出してコードコピーを有効化する。
    parseMarkdown();
  };

  return (
    <>
      <div className="flex h-[120dvh] flex-col gap-2">
        <LabelInput label="絵文字" id="emoji" placeholder="" type="text" />
        <LabelInput label="タイトル" id="title" placeholder="" type="text" />
        <div className="flex grow flex-col gap-1.5">
          <div>
            <Label>内容</Label>
            <span className="text-sm">{' *マークダウンで記載してください。'}</span>
          </div>
          <div className="flex h-full">
            <Tabs defaultValue="code" className="h-full w-1/2 grow">
              <SimpleTabsList>
                <SimpleTabsTrigger value="code" className="text-xs">
                  コード
                </SimpleTabsTrigger>
                <SimpleTabsTrigger
                  value="preview"
                  className="text-xs"
                  onClick={() => handlePreviewClick()}
                >
                  プレビュー
                </SimpleTabsTrigger>
              </SimpleTabsList>
              {/* NOTE: TabsContentの高さを減らす場合はここを調整 e.g. h-5/6 etc. */}
              <TabsContent value="code" className="h-full">
                <Textarea
                  className="h-full max-h-[100dvh]"
                  value={markdownValue}
                  onChange={(e) => handleTextareaChange(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="preview" className="h-full">
                <Preview className="max-h-[100dvh]" />
              </TabsContent>
            </Tabs>
            <div className="hidden h-full w-1/2 grow p-2 lg:flex lg:flex-col lg:gap-4">
              <div className="text-sm font-bold">プレビュー</div>
              <Preview className="mt-1 max-h-[100dvh]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostNewPage;
