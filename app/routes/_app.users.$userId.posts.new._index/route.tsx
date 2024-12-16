import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { toastError, toastSuccess } from '~/components/shadcn/custom/custom-toaster';
import { SimpleTabsList, SimpleTabsTrigger } from '~/components/shadcn/custom/simple-tabs';
import { Button } from '~/components/shadcn/ui/button';
import { Label } from '~/components/shadcn/ui/label';
import { Tabs, TabsContent } from '~/components/shadcn/ui/tabs';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { ClientOnly } from '~/components/shared/client-only';
import { LabelInput } from '~/components/shared/label-input';
import { OkCancelDialog } from '~/components/shared/ok-cancel-dialog';
import { Spinner } from '~/components/shared/spinner';
import { CreatePostInput, PostStatus, UpdatePostInput } from '~/lib/graphql/@generated/graphql';
import { createPost } from '~/services/post/create-post';
import { updatePost } from '~/services/post/update-post';
import { getFormData } from '~/utils/form-data';
import { Preview } from './components/preview';
import { useMarkdownValueStore } from './stores/markdown-value-store';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  return json({ userId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const postId = form.get('postId') as string | null;

  if (postId) {
    // 更新
    const updatePostInput: UpdatePostInput = {
      ...getFormData<UpdatePostInput>(form, ['postId']),
      id: postId,
      status: PostStatus.Draft,
    };
    const data = await updatePost(updatePostInput, request);
    // console.log(data);
    return json(data);
  } else {
    // 新規作成
    const createPostInput: CreatePostInput = {
      ...getFormData<CreatePostInput>(form, ['postId']),
      status: PostStatus.Draft,
    };
    const data = await createPost(createPostInput, request);
    // console.log(data);
    return json(data);
  }
};

/**
 * 記事作成ページ
 * @returns
 */
const PostNewPage = () => {
  const { userId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const [postId, setPostId] = useState<string | null>(null); // postId の状態管理
  const [errorMessage, setErrorMessage] = useState('');
  const { markdownValue, setMarkdownValue, parseMarkdown } = useMarkdownValueStore();

  useEffect(() => {
    parseMarkdown();
  }, [parseMarkdown]);

  useEffect(() => {
    if (actionData) {
      if (actionData?.success) {
        setErrorMessage('');
        if (actionData.data?.id) {
          setPostId(actionData.data?.id); // サーバーから返却された postId を保存
          toastSuccess('下書きを更新しました。');
        } else {
          toastSuccess('下書きを保存しました。');
        }
      } else {
        const message = actionData?.error?.message ?? 'unknwon error';
        setErrorMessage(message);
        toastError(message);
      }
    }
  }, [actionData]);

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
    <ClientOnly fallback={<Spinner />}>
      {() => (
        <div>
          <Form className="flex h-[130dvh] flex-col gap-2" method="POST">
            {/* postId を隠しフィールドで送信 */}
            <input type="hidden" name="postId" value={postId ?? ''} />
            <div className="flex items-center justify-between">
              <OkCancelDialog
                clickHandler={() => handleBackClick()}
                descriptions={[
                  'エラーが発生している場合、編集中の内容は破棄されます。',
                  '前のページに戻ってもよろしいですか？',
                  errorMessage && '👇',
                  errorMessage && `error: ${errorMessage}`,
                ]}
              >
                <Button variant="ghost" type="submit">
                  戻る
                </Button>
              </OkCancelDialog>
              <div className="flex gap-4">
                <Button variant="ghost" type="submit">
                  下書きに保存
                </Button>
                <Button variant="ghost" type="button">
                  公開に進む
                </Button>
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
        </div>
      )}
    </ClientOnly>
  );
};

export default PostNewPage;
