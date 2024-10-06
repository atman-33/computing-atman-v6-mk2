# 初期セットアップ

## ステップ

### インストール

- プロジェクトを作成するディレクトリに移動する。

```sh
cd {任意のディレクトリ}
```

- Remixをインストールする。

```sh
npx create-remix@latest
```

> コマンドにしたがって、プロジェクトを作成する。

### サーバーのポートを変更（任意）

- ポートはvite.config.tsで設定する

`.env`

```text
PORT=3000
```

`vite.config.ts`

```ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// 参考URL
// <https://vite.dev/config/#using-environment-variables-in-config>

export default ({ mode }: { mode: string; }) => {

  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
    ],

    server: {
      port: parseInt(env.PORT ?? 5173),
    },
  });
};
```
