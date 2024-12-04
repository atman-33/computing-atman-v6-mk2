# Jestのセットアップ方法

> vitestを利用する場合、jestは不要となります。

## ステップ

### インストール

```sh
npm i -D typescript jest ts-jest @types/jest ts-node
```

### 設定ファイルを変更

- 設定ファイル生成コマンドで、`jest.config.ts`を生成する。

```sh
npx jest --init
```

```sh
√ Would you like to use Typescript for the configuration file? ... yes
√ Choose the test environment that will be used for testing » node
√ Do you want Jest to add coverage reports? ... yes
√ Which provider should be used to instrument code for coverage? » v8
√ Automatically clear mock calls, instances, contexts and results before every test? ... yes
```

- presetを追加する。

`jest.config.ts`

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};

export default config;
```

### テスト実行のスクリプトを追加

`package.json`

```json
    "---- TEST SECTION ----": "---- ---- ---- ---- ----",
    "test-jest": "jest"
```

### gitignoreを設定

coverageを保存したくない場合は、gitignoreの設定をする。  

`.gitignore`

```text
# jest
coverage
```

### save時にJest自動実行をOFFにする

`settings.json`

```json
  "jest.runMode": "on-demand",
```
