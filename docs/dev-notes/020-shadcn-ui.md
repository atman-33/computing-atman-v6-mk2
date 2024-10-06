# shadcn/uiのセットアップ方法

## ステップ

### インストール

```sh
npx shadcn@latest init
```

```sh
✔ Which style would you like to use? › Default
✔ Which color would you like to use as the base color? › Zinc
✔ Would you like to use CSS variables for theming? … yes
```

- `lib/utils.ts`を`utils/cn.ts`に移動する（合わせてファイル名も変更）。

### components.jsonを変更

`components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/tailwind.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "~/components/shadcn",
    "utils": "~/utils/cn",
    "ui": "~/components/shadcn/ui",
    "lib": "~/lib",
    "hooks": "~/hooks"
  }
}
```

### `[不具合]`tailwind.config.tsのfontFamilyを修正

パッケージVer. によっては、configのfontFamilyが崩れるためエラーを解消するようにコードを修正する。

`tailwind.config.ts`

```ts
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji"',
          'Segoe UI Emoji"',
          'Segoe UI Symbol"',
          'Noto Color Emoji"',
        ],
      },
```

## eslint, prettier無視の設定

`..eslintrc.cjs`

- ignorePatternsに、`app/components/ui`を追加

```cjs
/** @type {import('eslint').Linter.Config} */
module.exports = {
  // ...
  ignorePatterns: ['!**/.server', '!**/.client', 'app/components/shadcn/ui'],
  // ...
```

`.prettierignore`

```sh
# shadcn/ui
app/components/shadcn/ui
```
