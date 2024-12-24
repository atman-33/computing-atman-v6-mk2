# favicon 設定方法

Remix で、 favicon を設定する方法です。

## 参考URL

- [favicon-converter](https://favicon.io/favicon-converter/)  
- [favicon generator](https://realfavicongenerator.net/)

> favicon generator では、 safari-pinned-tab.svg ファイルも作成可能

- [Remix links](https://remix.run/docs/zh/main/route/links#links)

## ステップ

### 1. favicon を生成

[favicon generator](https://realfavicongenerator.net/)サイトで、favicon用のファイル一式を生成

### 2. publicフォルダにfaviconファイルを保存

1. `public/favicons`に生成したfacivonファイル等を保存する。

2. `browserconfig.xml`と`site.webmanifest`を、`apps/web/public`に移動する。

3. `site.webmanifest`は、iconsの`src`を修正する。

    ```json
      "icons": [
        {
    -     "src": "/android-chrome-192x192.png",
    +     "src": "/favicons/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
    -     "src": "/android-chrome-192x192.png",
    +     "src": "/favicons/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
    ```

4. `root.tsx`のlinksにfaviconを設定する。

    `app/root.tsx`

    ```tsx
    // ...
    export const links: LinksFunction = () => [
    { rel: 'icon', href: '/favicons/favicon.ico', type: 'image/png' },
    { rel: 'stylesheet', href: tailwind },
    ];
    // ...
    ```

## 参考. Next.jsでfaviconを適用する方法

layout.tsxのMetadataに、faviconを追加する。  

`apps/web/src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  ...
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/favicon-16x16.png',
    apple: '/favicons/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};
```
