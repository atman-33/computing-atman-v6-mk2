# eslint, prettierセットアップ

## prettierの設定を追加

`.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100
}
```

## TaiwindCSSのclassの順番並び替え

```sh
npm install -D prettier prettier-plugin-tailwindcss
```

`.prittierrc`

```json
{
  // ...,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**上記を設定しただけでは動作しないため注意！**  

- 「コマンドパレット」( CTRL + SHIFT + P) > 「ウィンドウの再読み込み」で VS Code を再読み込みすると、プラグインがようやく動作する。

> 参考URL
> [TaiwindCSSのclassの順番並び替えを最速で導入する](https://zenn.dev/nbr41to/articles/e1fe669ae37875)
