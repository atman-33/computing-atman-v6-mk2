# Uploadcareの画像アップロード機能作成方法

## 参考URL

- [How to upload files in React](https://uploadcare.com/blog/how-to-upload-file-in-react/)
- [Remix v2 でクライアントサイドに環境変数を渡す方法](https://www.gaji.jp/blog/2024/09/25/20881/)

## ステップ

### Uploadcare登録

1. <https://uploadcare.com/>に移動 > Start now for free ボタンをクリック
2. アカウントを登録
3. 任意のプロジェクトを作成

以下の手順は、Uploadcareの Workspace > project 画面の Get started を参考にしている。

### ライブラリをインストール

```sh
npm i @uploadcare/react-uploader
```

### UploadcareのAPIキーを環境変数に登録

`.env`

```sh
# Uploadcare
VITE_UPLOADCARE_PUBLIC_KEY='****'
```

> UploadcareのAPIキーは、Uploadcareプロジェクト画面 > API keys 画面から確認可能

`app/config/client-env.ts`

```ts
export const clientEnv = {
  VITE_UPLOADCARE_PUBLIC_KEY: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY,
};
```

### ファイルアップロード用のページを作成

`app/routes/_.poc.image-uploader._index/file-uploader.tsx`

```tsx
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import { useEffect, useState } from 'react';
import { clientEnv } from '~/config/client-env';

// NOTE: FileUploaderRegularはクライアントサイド用コンポーネントのため、useEffect実行後にコンポーネントを描させる必要がある。

export const FileUploader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? (
        <FileUploaderRegular
          sourceList="local, url, camera"
          pubkey={clientEnv.VITE_UPLOADCARE_PUBLIC_KEY}
        />
      ) : null}
    </div>
  );
};
```

`app/routes/_.poc.image-uploader._index/route.tsx`

```tsx
import '@uploadcare/react-uploader/core.css';
import { FileUploader } from './file-uploader';

const ImageUploaderPage = () => {
  return (
    <div className="m-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Uploadcare</h2>
      <FileUploader />
    </div>
  );
};

export default ImageUploaderPage;
```
