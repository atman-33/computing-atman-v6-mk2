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
