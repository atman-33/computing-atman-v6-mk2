import '@uploadcare/react-uploader/core.css';
import { useState } from 'react';
import { Input } from '~/components/shadcn/ui/input';
import { UploadcareFileUploaderRegular } from './uploadcare-file-uploader-regular';

const ImageUploaderPage = () => {
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="m-8 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Uploadcare</h2>
        <div className="flex flex-col items-center gap-2">
          <h3>FileUploaderRegular</h3>
          <UploadcareFileUploaderRegular />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap">画像URL</span>
          <Input
            className="w-full"
            type="text"
            value={imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
          />
        </div>
        {imageUrl && <img src={imageUrl} width="300" height="300" alt="preview"></img>}
      </div>
    </div>
  );
};

export default ImageUploaderPage;
