import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { redirect, useActionData, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import { toastError, toastSuccess } from '~/components/shadcn/custom/custom-toaster';
import { SimpleTabsList, SimpleTabsTrigger } from '~/components/shadcn/custom/simple-tabs';
import { Button } from '~/components/shadcn/ui/button';
import { Label } from '~/components/shadcn/ui/label';
import { Tabs, TabsContent } from '~/components/shadcn/ui/tabs';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { ClientOnly } from '~/components/shared/client-only';
import { LabelInputField } from '~/components/shared/label-input-filed';
import { OkCancelDialog } from '~/components/shared/ok-cancel-dialog';
import { Spinner } from '~/components/shared/spinner';
import { CreatePostInput, PostStatus, UpdatePostInput } from '~/lib/graphql/@generated/graphql';
import { createPost } from '~/services/post/create-post';
import { updatePost } from '~/services/post/update-post';
import { parseFormData } from '~/utils/form-data';
import { Preview } from './components/preview';
import { postValidator } from './post-validator';
import { useMarkdownValueStore } from './stores/markdown-value-store';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  const postId = params.postId;
  // console.log('loader postId:', postId);

  // TODO: postIdが埋め込まれている場合は、既存データを取得する処理を追加

  return json({ userId, postId });
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
  const { userId, postId: urlPostId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const [postId, setPostId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const { markdownValue, setMarkdownValue, parseMarkdown } = useMarkdownValueStore();

  /**
   * URLのpostIdが変更されたときにpostIdを更新（レンダリングトリガー）。
   * この処理によって、公開ボタンのdesabled属性が更新される。
   */
  useEffect(() => {
    // NOTE: URLの$postIdが`new`の場合は新規作成として扱う。
    setPostId(urlPostId === 'new' ? undefined : urlPostId);
  }, [urlPostId]);

  /**
   * マークダウンの初回パース処理。レンダリング後にマークダウンのCSSを反映させる。
   */
  useEffect(() => {
    parseMarkdown();
  }, [parseMarkdown]);

  /**
   * 下書き保存ボタンクリック時にactionから返ってきたデータの処理
   */
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        setErrorMessage('');
        if (actionData.data?.id) {
          setPostId(actionData.data?.id); // サーバーから返却された postId を保存
          toastSuccess('下書きを保存しました。');
          // NOTE: 下書き保存後はURLのpostIdを更新する。
          navigate(`/users/${userId}/posts/${actionData.data?.id}/edit`);
          // NOTE: 下記のfetchr.submitを使ってリダイレクトする方法もあるが、navigateの方がシンプル
          // fetcher.submit(
          //   { targetUrl: `/users/${userId}/posts/${actionData.data?.id}/edit` },
          //   { method: 'POST', action: '/resources/redirect' },
          // );
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
   * テキストエリアの変更イベントを処理する。
   * この関数は提供されたコードでマークダウンの値の状態を更新し、その後マークダウンを解析する。
   * @param code
   */
  const handleTextareaChange = (code: string) => {
    setMarkdownValue(code);
    parseMarkdown();
  };

  /**
   * 戻るボタンクリック時の処理。現在のユーザーの投稿一覧ページに遷移する。
   */
  const handleBackClick = () => {
    navigate(`/users/${userId}/posts`);
  };

  /**
   * プレビューを表示するタブをクリックしたときの処理。
   * タブ切替後はparseMarkdown()を呼び出してコードブロックコピーを有効化する。
   */
  const handlePreviewClick = () => {
    parseMarkdown();
  };

  return (
    <ClientOnly fallback={<Spinner />}>
      {() => (
        <div>
          <ValidatedForm
            validator={postValidator}
            className="flex h-[130dvh] flex-col gap-2"
            method="POST"
          >
            {/* NOTE: postId を隠しフィールドで送信 */}
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
                  disabled={!postId}
                  name="_action"
                  value="publish"
                >
                  公開に進む
                </Button>
              </div>
            </div>
            <LabelInputField label="絵文字" name="emoji" placeholder="" type="text" />
            <LabelInputField label="タイトル" name="title" placeholder="" type="text" />
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
          </ValidatedForm>
        </div>
      )}
    </ClientOnly>
  );
};

export default PostEditPage;
