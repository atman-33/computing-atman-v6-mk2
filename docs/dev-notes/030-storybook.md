# Storybookのセットアップ方法

## 参考URL

[Storybook for React & Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)

## ステップ

### インストール

```sh
npx storybook@latest init
```

> 不要な`stories`フォルダ（サンプル）は削除しておく。

### Storybook用のvite-storybook.config.tsを生成

```sh
touch vite-storybook.config.ts
```

`vite-storybook.config.ts`

```ts
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  return {
    plugins: [tsconfigPaths()],
  };
});
```

### main.tsを修正

- storiesの対象パスを変える(appフォルダ内を対象)
- builderオプションに`vite-storybook.config.ts`を設定

`.storybook\main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../app/**/*.mdx', '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite-storybook.config.ts',
      },
    },
  },
};
export default config;
```

### StorybookにTailwind CSSを適応する

`preview.ts`に、Tailwind CSSのスタイルをimportする。

`.storybook\preview.ts`

```ts
import type { Preview } from '@storybook/react';
import '../app/tailwind.css';

const preview: Preview = {
// ...
```

## 利用方法

例として、shadcn/uiのボタンを表示してみる。

`button.stories.tsx`

```tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select'}, 
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select'}, 
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: { control: 'boolean' },
  },
};

export default meta;

type Story= StoryObj<typeof Button>;

export const Default :Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
  }
}

export const Destructive :Story = {
  args: {
    variant: 'destructive',
    size: 'default',
    children: 'Button',
  }
}

export const Outline :Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
  }
}

export const Secondary :Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Button',
  }
}

export const Ghost :Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
  }
}

export const Link :Story = {
  args: {
    variant: 'link',
    size: 'default',
    children: 'Button',
  }
}
```

Storybookを起動する。

```sh
npm run storybook
```
