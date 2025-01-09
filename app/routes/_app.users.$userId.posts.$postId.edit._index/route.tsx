import { getFormProps } from '@conform-to/react';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { toastError, toastSuccess } from '~/components/shadcn/custom/custom-toaster';
import { SimpleTabsList, SimpleTabsTrigger } from '~/components/shadcn/custom/simple-tabs';
import { Button } from '~/components/shadcn/ui/button';
import { Label } from '~/components/shadcn/ui/label';
import { Tabs, TabsContent } from '~/components/shadcn/ui/tabs';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { ClientOnly } from '~/components/shared/client-only';
import LabelInput from '~/components/shared/conform/label-input';
import { OkCancelDialog } from '~/components/shared/ok-cancel-dialog';
import { Spinner } from '~/components/shared/spinner';
import {
  CreatePostInput,
  GetPostArgs,
  PostStatus,
  UpdatePostInput,
} from '~/lib/graphql/@generated/graphql';
import { createPost } from '~/services/post/create-post';
import { getPost } from '~/services/post/get-post';
import { updatePost } from '~/services/post/update-post';
import { parseFormData } from '~/utils/form-data';
import { Preview } from './components/preview';
import { usePostForm } from './hooks/use-post-form';
import { EditPost, useEditPostStore } from './stores/edit-post-store';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  const urlPostId = params.postId;

  // params.postIdがnewでない場合は記事データを取得
  let loaderPostData = null;
  if (urlPostId !== 'new') {
    loaderPostData = await getPost({ id: urlPostId } as GetPostArgs);
  }

  return json({ userId, urlPostId, loaderPostData });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.formData();
  const postId = form.get('postId') as string;
  const action = form.get('_action') as 'back' | 'save' | 'publish';

  switch (action) {
    case 'back':
    case 'save':
      if (postId) {
        // データ更新
        const updatePostInput: UpdatePostInput = {
          ...parseFormData<UpdatePostInput>(form, { excludeKeys: ['postId', '_action'] }),
          id: postId,
          status: PostStatus.Draft,
        };
        const data = await updatePost(updatePostInput, request);
        return json(data);
      } else {
        // データ新規作成
        const createPostInput: CreatePostInput = {
          ...parseFormData<CreatePostInput>(form, { excludeKeys: ['postId', '_action'] }),
          status: PostStatus.Draft,
        };
        const data = await createPost(createPostInput, request);
        return json(data);
      }
    case 'publish': {
      // データ更新してからリダイレクト
      const updatePostInput: UpdatePostInput = {
        ...parseFormData<UpdatePostInput>(form, { excludeKeys: ['postId', '_action'] }),
        id: postId,
        status: PostStatus.Draft,
      };
      await updatePost(updatePostInput, request);
      return redirect(`/users/${params.userId}/posts/${postId}/edit/publish`);
    }
  }
};

/**
 * 記事作成ページ
 * @returns
 */
const PostEditPage = () => {
  const { userId, urlPostId, loaderPostData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const [form, { emoji, title }] = usePostForm();
  const post = useEditPostStore((state) => state.post);
  const resetPost = useEditPostStore((state) => state.resetPost);
  const updatePost = useEditPostStore((state) => state.updatePost);
  const updateContentHtml = useEditPostStore((state) => state.updateContentHtml);

  const [errorMessage, setErrorMessage] = useState('');

  // URLのpostId変更時にpostIdを更新する。同時に公開ボタンのdesabled属性も更新される。
  useEffect(() => {
    // NOTE: URLの$postIdが`new`の場合は新規作成として扱う。
    if (urlPostId === 'new') {
      resetPost();
      updatePost({ id: undefined });
    } else {
      if (loaderPostData?.success) {
        updatePost({
          id: urlPostId,
          emoji: loaderPostData.data?.emoji ?? '',
          title: loaderPostData.data?.title ?? '',
          content: loaderPostData.data?.content ?? '',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPostId]);

  // 下書き保存ボタンクリック時にactionから返ってきたデータを処理する。
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        setErrorMessage('');
        if (actionData.data?.id) {
          updatePost({ id: actionData.data?.id }); // サーバーから返却された postId を保存
          toastSuccess('下書きを保存しました。');
          // NOTE: 下書き保存後はURLのpostIdを更新する。単純なURL変更のためuseNavigateを利用
          navigate(`/users/${userId}/posts/${actionData.data?.id}/edit`);
        }
      } else {
        const message = actionData.error?.message ?? 'unknwon error';
        setErrorMessage(message);
        toastError(message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  /**
   * 戻るボタンクリック時の処理。現在のユーザーの投稿一覧ページに遷移する。
   */
  const handleBackClick = () => {
    navigate(`/users/${userId}/posts`);
  };

  /**
   * プレビュータブをクリックしたときの処理。
   */
  const handlePreviewClick = () => {
    // NOTE: コードブロックのコピー機能を有効化するためにupdateContentHtml()を呼び出す。
    updateContentHtml();
  };

  /**
   * 編集投稿フォームの入力フィールドの変更イベントを処理します。
   *
   * @param field - 更新されるEditPostオブジェクトのフィールドのキー。
   * @param value - 指定されたフィールドの新しい値。
   */
  const handleInputChange = useCallback(
    (field: keyof EditPost, value: string) => {
      updatePost({ [field]: value });
    },
    [updatePost],
  );

  return (
    <ClientOnly fallback={<Spinner />}>
      {() => (
        <div>
          <Form {...getFormProps(form)} className="flex h-[130dvh] flex-col gap-2" method="POST">
            {/* NOTE: postId を隠しフィールドで送信 */}
            <input type="hidden" name="postId" value={post.id ?? ''} />
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
                <Button variant="ghost" type="submit" name="_action" value="back">
                  戻る
                </Button>
              </OkCancelDialog>
              <div className="flex gap-4">
                <Button variant="ghost" type="submit" name="_action" value="save">
                  下書きに保存
                </Button>
                <Button
                  variant="ghost"
                  type="submit"
                  disabled={!post.id}
                  name="_action"
                  value="publish"
                >
                  公開に進む
                </Button>
              </div>
            </div>
            <LabelInput
              metadata={emoji}
              options={{ type: 'text' }}
              label="絵文字"
              placeholder=""
              value={post.emoji}
              onChange={(value) => handleInputChange('emoji', value)}
            />
            <LabelInput
              metadata={title}
              options={{ type: 'text' }}
              label="タイトル"
              placeholder=""
              value={post.title}
              onChange={(value) => handleInputChange('title', value)}
            />
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
                      value={post.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
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

export default PostEditPage;
