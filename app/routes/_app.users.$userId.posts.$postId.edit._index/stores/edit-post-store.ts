import DOMPurify from 'dompurify';
import { create } from 'zustand';
import { getMarked } from '~/lib/marked';

export interface EditPost {
  id: string | undefined;
  emoji: string;
  title: string;
  content: string;
}

const initialEditPost: EditPost = {
  id: undefined,
  emoji: '',
  title: '',
  content: '',
};

interface EditPostStore {
  post: EditPost;
  contentHtml: string;
  setPost: (post: EditPost) => void;
  updatePost: (updatedFields: Partial<EditPost>) => void;
  updateContentHtml: () => void;
  resetPost: () => void;
}

export const useEditPostStore = create<EditPostStore>((set, get) => {
  // Marked インスタンスを取得
  const marked = getMarked();

  return {
    post: initialEditPost,
    contentHtml: '',
    setPost: (post) => {
      set({ post });
      get().updateContentHtml();
    },
    updatePost: (updatedFields) => {
      set((state) => ({
        post: { ...state.post, ...updatedFields },
      }));
      get().updateContentHtml();
    },
    updateContentHtml: () => {
      const { post } = get();
      if (post) {
        const rawHtml = marked.parse(post.content);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml as string);
        set({ contentHtml: sanitizedHtml });
      }
    },
    resetPost: () => {
      set({ post: initialEditPost, contentHtml: '' });
    },
  };
});
