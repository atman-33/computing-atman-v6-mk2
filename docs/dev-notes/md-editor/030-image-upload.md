# 画像をドラッグアンドドロップで追加する方法

- 画像ストレージサービスはuploadcareを利用する場合を例として記載

## ステップ

### 画像アップロード機能を追加

`app/routes/__.poc.md-editor._index/route.tsx`

- 画像アップロード関数を追加

```tsx
import { uploadFile } from '@uploadcare/upload-client';
import { clientEnv } from '~/config/client-env';

const MarkdownEditorPage = () => {
  // ...
  const imageUploadFunction = async (file: File) => {
    console.log(file.name);
    const result = await uploadFile(file, {
      publicKey: clientEnv.VITE_UPLOADCARE_PUBLIC_KEY,
      store: 'auto',
      metadata: {
        subsystem: 'js-client',
        note: 'test',
      },
    });

    // アップロードした画像のURLを取得してマークダウンに埋め込む
    setMarkdownValue((pre) => {
      return pre + '\n\n' + `![image](https://ucarecdn.com/${result.uuid}/-/preview/233x96/)`;
    });
  };

  const autoUploadImage = useMemo(() => {
    return {
      uploadImage: true,
      imageUploadFunction,
    };
  }, []);
```

- SimpleMdeコンポーネントのオプションに、画像アップロードオプションを設定

```tsx
const MarkdownEditorPage = () => {
    // ...
    return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MemoizedMed
          value={markdownValue}
          onChange={handleMarkdownChange}
          options={autoUploadImage}
        />
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
}
```
