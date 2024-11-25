# Zustandセットアップ

## 参考URL

- [Reactで状態管理 初心者でも簡単Zustandの設定方法](https://reffect.co.jp/react/zustand#count-3)
- [Next.jsでReact状態管理ライブラリのZustandを使ってみる](https://zenn.dev/collabostyle/articles/034e047216dba2)

## ステップ

### インストール

```sh
npm i zustand
```

### 利用例

`todo-store.ts`

```ts
import { create, useStore } from "zustand";

type TodoStore = {
    todos: string[];
    addTodo: (todo: string) => void;
    removeTodo: (todo: string) => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [],
    addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
    removeTodo: (todo) => set((state) => ({ todos: state.todos.filter((t) => t !== todo) })),
}));
```

```tsx
const TodoLists = () => {
  const {todos, removeTodo} = useTodoStore();
  // ...
```
