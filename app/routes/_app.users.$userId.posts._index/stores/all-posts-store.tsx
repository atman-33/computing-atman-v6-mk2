import { create } from 'zustand';
import { PostEdges } from '../types';

interface AllPostsStore {
  allPosts: PostEdges;
  setAllPosts: (posts: PostEdges) => void;
  addPosts: (posts: PostEdges) => void;
  removePost: (id: string) => void;
}

export const useAllPostsStore = create<AllPostsStore>((set) => {
  return {
    allPosts: null,
    setAllPosts: (posts) => {
      set({ allPosts: posts });
    },
    addPosts: (posts) => {
      set((prev) => ({
        allPosts: [...(prev.allPosts || []), ...(posts ?? [])],
      }));
    },
    removePost: (id) => {
      set((prev) => ({
        allPosts: (prev.allPosts || []).filter((post) => post?.node?.id !== id),
      }));
    },
  };
});
