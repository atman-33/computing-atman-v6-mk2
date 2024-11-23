import { Label } from '~/components/shadcn/ui/label';
import { Textarea } from '~/components/shadcn/ui/textarea';
import { LabelInput } from '~/components/shared/label-input';

// TODO: マークダウンのプレビュー画面を追加

const PostNewPage = () => {
  return (
    <>
      <div className="flex h-[80dvh] flex-col gap-4">
        <LabelInput label="絵文字 *" id="emoji" placeholder="" type="text" />
        <LabelInput label="タイトル *" id="title" placeholder="" type="text" />
        <div className="flex grow flex-col gap-1.5">
          <div>
            <Label>内容 *</Label>
            <span className="text-sm">{' マークダウンで記載してください。'}</span>
          </div>
          <Textarea className="h-full" />
        </div>
      </div>
    </>
  );
};

export default PostNewPage;
