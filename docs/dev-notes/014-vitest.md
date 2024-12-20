# Vitestのセットアップ方法

## 参考URL

- [Remix に Vitest を導入する](https://zenn.dev/masayuki_0319/articles/0246f98bafc89c)

## ステップ

### パッケージをインストール

```sh
npm i -D vitest
```

### テスト実行のスクリプトを追加

`package.json`

```json
    "--- TEST SECTION ---": "--- --- --- --- ---",
    "test": "vitest"
```

### テスト関数 import 省略設定

`vitest.cnfig.ts`

```ts
import { ConfigEnv, defineConfig, mergeConfig } from 'vitest/config';
import baseViteConfig from './vite.config';

export default defineConfig(async (configEnv: ConfigEnv) => {
  // NOTE: 環境変数の読み込み（loadEnv()）が非同期的なためawaitを設定
  const baseConfig = await baseViteConfig(configEnv);
  // console.log('vitest port => ', baseConfig.server?.port);

  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        globals: true,
      },
    }),
  );
});
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "types": [
      // ...
+      "vitest/globals"
    ]
  }
}
```

### VSCodeの拡張機能をインストール

VSCode 拡張機能 [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) をインストールします。

## カバレッジを追加

### カバレッジのパッケージをインストール

```sh
npm i -D @vitest/coverage-v8sh
```

### gitにcoverageフォルダを含めないように設定

`.gitignore`

```sh
/coverage
```

### coverage対象外のフォルダを設定

`vitest.config.ts`

```ts
import { ConfigEnv, defineConfig, mergeConfig } from 'vitest/config';
import baseViteConfig from './vite.config';

export default defineConfig(async (configEnv: ConfigEnv) => {
  // NOTE: 環境変数の読み込み（loadEnv()）が非同期的なためawaitを設定
  const baseConfig = await baseViteConfig(configEnv);
  // console.log('vitest port => ', baseConfig.server?.port);

  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        globals: true,
        coverage: {
          exclude: ['build/**/*', 'public/**/*', 'tools/**/*'],
        },
      },
    }),
  );
});
```
