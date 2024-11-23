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
