import { create } from 'zustand';

type MarkdownValueStore = {
  markdownValue: string;
  setMarkdownValue: (value: string) => void;
};

export const useMarkdownValueStore = create<MarkdownValueStore>((set) => ({
  markdownValue: '',
  setMarkdownValue: (value) => {
    set((state) => ({ ...state, markdownValue: value }));
  },
}));
