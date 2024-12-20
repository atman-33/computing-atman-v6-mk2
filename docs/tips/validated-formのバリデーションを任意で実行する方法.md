# ValidatedFormのバリデーションを任意で実行する方法

## サンプルコード

e.g.  

```ts
  const handleButtonClick = async (e: React.MouseEvent) => {
    // NOTE: クリックしたボタンが属するフォームを取得
    const form = e.currentTarget.closest('form');
    if (form) {
      const isValid = await postValidator.validate(new FormData(form));
      if (isValid.error) {
        toastError('入力内容にエラーがあります');
      } else {
        // 問題無い場合の処理を記述...
      }
    }
  };
```
