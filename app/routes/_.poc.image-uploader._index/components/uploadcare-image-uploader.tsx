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
