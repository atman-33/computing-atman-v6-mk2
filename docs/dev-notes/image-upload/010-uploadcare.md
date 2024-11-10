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

`app/routes/_.poc.image-uploader._index/components/uploadcare-file-uploader-regular.tsx`

```tsx
import { FileUploaderRegular, Metadata, SourceTypes } from '@uploadcare/react-uploader';
import { useEffect, useState } from 'react';
import { clientEnv } from '~/config/client-env';

// NOTE: FileUploaderRegularはクライアントサイド用コンポーネントのため、useEffect実行後にコンポーネントを描させる必要がある。

interface FileUploadSuccessEvent {
  status: 'success';
  internalId: string;
  name: string;
  size: number;
  isImage: boolean;
  mimeType: string;
  metadata: Metadata | null;
  file: File | Blob | null;
  externalUrl: string | null;
  uploadProgress: number;
  fullPath: string | null;
  source: SourceTypes | null;
  uuid: string;
}

export const UploadcareFileUploaderRegular = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onFileUpload = (e: FileUploadSuccessEvent) => {
    // NOTE: ここでファイルアップロード後の情報を取得できる。
    console.log(e);
  };

  return (
    <div>
      {isClient ? (
        <FileUploaderRegular
          sourceList="local, url, camera"
          pubkey={clientEnv.VITE_UPLOADCARE_PUBLIC_KEY}
          onFileUploadSuccess={(e) => onFileUpload(e)}
        />
      ) : null}
    </div>
  );
};
```

`app/routes/_.poc.image-uploader._index/route.tsx`

```tsx
import '@uploadcare/react-uploader/core.css';
import UploadcareImageUploader from './components/uploadcare-image-uploader';

const ImageUploaderPage = () => {
  return (
    <div className="m-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Uploadcare</h2>
      <UploadcareFileUploaderRegular />
    </div>
  );
};

export default ImageUploaderPage;
```

### ドラッグアンドドロップでファイルをアップロードするコンポーネントを作成

- ライブラリをインストール

```sh
npm install @uploadcare/upload-client
```

- コンポーネントを作成

`app/routes/_.poc.image-uploader._index/components/uploadcare-image-uploader.tsx`

```tsx
import { uploadFile } from '@uploadcare/upload-client';
import { useState } from 'react';
import { Button } from '~/components/shadcn/ui/button';
import { clientEnv } from '~/config/client-env';
import ImageLogo from './image.svg';

const UploadcareImageUploader = () => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleDragEnter = (e: React.DragEvent<HTMLInputElement>) => {
    if (e.dataTransfer === null) {
      return;
    }

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    console.log(e.dataTransfer.files[0].name);
    if (e.dataTransfer.files !== null && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length === 1) {
        const result = await uploadFileToUploadcare(e.dataTransfer.files[0]);
        console.log(result.uuid);
      } else {
        alert('ファイルは１個まで！');
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileUploadToUploadcare = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }

    // console.log(e.target.files[0].name);
    const file = e.target.files[0];

    const result = await uploadFileToUploadcare(file);
    console.log(result.uuid);
  };

  const uploadFileToUploadcare = async (file: File) => {
    const result = await uploadFile(file, {
      publicKey: clientEnv.VITE_UPLOADCARE_PUBLIC_KEY,
      store: 'auto',
      metadata: {
        subsystem: 'js-client',
        note: 'test',
      },
    });
    // console.log(result.uuid);
    return result;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="title flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">画像アップローダー</h2>
        <p>JpegかPngの画像ファイル</p>
      </div>
      <div className="relative flex flex-col items-center">
        <div
          className={`transition-color flex flex-col items-center gap-2 rounded-md border-2 border-dashed px-16 py-9 duration-700 ${isDragActive && 'border-blue-500 bg-blue-50'}`}
        >
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input
          className="absolute left-0 top-0 h-[100%] w-[100%] cursor-pointer opacity-0 file:cursor-pointer"
          name="imageURL"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={(e) => handleFileUploadToUploadcare(e)}
          onDragEnter={(e) => handleDragEnter(e)}
          onDragLeave={() => handleDragLeave()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e)}
        />
      </div>
      <p>または</p>
      <Button variant="default" className="relative">
        ファイルを選択
        <input
          className="absolute left-0 top-0 h-[100%] w-[100%] cursor-pointer opacity-0 file:cursor-pointer"
          name="imageURL"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={(e) => handleFileUploadToUploadcare(e)}
        />
      </Button>
    </div>
  );
};

export default UploadcareImageUploader;
```
