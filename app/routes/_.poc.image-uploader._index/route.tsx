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
