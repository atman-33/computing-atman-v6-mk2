# envを扱うオブジェクトをセットアップ

`app/config/env.ts`

```ts
export const env = {
  SESSION_SECRET: process.env['SESSION_SECRET'] as string,
};
```

利用する環境変数が追加された場合は、上記に適宜追加する。
