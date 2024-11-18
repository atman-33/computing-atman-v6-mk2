export const getSystemTheme = () => {
  if (typeof window === 'undefined') {
    return 'light'; // SSR環境ではデフォルト値を返す
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
