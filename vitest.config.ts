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
