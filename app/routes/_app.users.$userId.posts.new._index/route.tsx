import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { SimpleTabsList, SimpleTabsTrigger } from '~/components/shadcn/custom/simple-tabs';
import { Button } from '~/components/shadcn/ui/button';
import { Label } from '~/components/shadcn/ui/label';
import { Tabs, TabsContent } from '~/components/shadcn/ui/tabs';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { LabelInput } from '~/components/shared/label-input';
import { OkCancelDialog } from '~/components/shared/ok-cancel-dialog';
import { CreatePostInput, PostStatus } from '~/lib/graphql/@generated/graphql';
import { createPost } from '~/services/post/create-post';
import { getFormData } from '~/utils/form-data';
import { Preview } from './components/preview';
import { useMarkdownValueStore } from './stores/markdown-value-store';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  return json({ userId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const createPostInput: CreatePostInput = {
    ...getFormData<CreatePostInput>(form),
    status: PostStatus.Draft,
  };
  const data = await createPost(createPostInput, request);
  // console.log(data);
  return json(data);
};

const PostNewPage = () => {
  const { userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { markdownValue, setMarkdownValue, parseMarkdown } = useMarkdownValueStore();

  useEffect(() => {
    parseMarkdown();
  }, [parseMarkdown]);

  const handleTextareaChange = (code: string) => {
    setMarkdownValue(code);
    parseMarkdown();
  };

  const handleBackClick = () => {
    navigate(`/users/${userId}/posts`);
  };

  const handlePreviewClick = () => {
    // NOTE: タブ切替後はparseMarkdown()を呼び出してコードコピーを有効化する。
    parseMarkdown();
  };

  return (
    <>
      <Form className="flex h-[130dvh] flex-col gap-2" method="POST">
        <div className="flex items-center justify-between">
          <OkCancelDialog
            clickHandler={() => handleBackClick()}
            description="保存していない場合、編集中の内容は破棄されます。前のページに戻ってもよろしいですか？"
          >
            <Button variant="ghost">戻る</Button>
          </OkCancelDialog>
          <div className="flex gap-4">
            <Button variant="ghost" type="submit">
              下書きに保存
            </Button>
            <Button variant="ghost">公開に進む</Button>
          </div>
        </div>
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
                  name="content"
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
      </Form>
    </>
  );
};

export default PostNewPage;
