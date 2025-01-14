# Conformのバリデーションエラーが表示されない

## 現象

- submitでactionにデータ送信後、navigateで同画面の動的セグメントを変更する。
- その後、インプットのバリデーションエラーが表示されなくなる。

## 対処方法

クライアントサイドでformのバリデーションエラーをコンソール出力すると、正常に表示されるようになる。

```ts
const PostEditPage = () => {
  const { userId, postId: urlPostId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, { emoji, title }] = usePostForm();
  const { markdownValue, setMarkdownValue, parseMarkdown } = useMarkdownValueStore();

  // NOTE: Conformのバリデーションエラーをコンソール出力しないと画面に表示されない。
  console.log(form.allErrors);
  // ...
```

2025/01/14追記: usePostForm内のuseEffectで、form.reset()をしていたため、上記の現象が発生した可能性あり。useEffectを削除するとコンソール出力せずともバリデーションエラーが表示されるように改善された。
