# RemixでHot reloadするとTailWindのスタイルが崩れる問題

## 参考URL

- [RemixでHot reloadするとTailWindのスタイルが崩れる問題](https://zenn.dev/tomolld/articles/f74ce0418102d5)

## 対処法

`root.tsx`

```tsx
import tailwind from './tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];
```
