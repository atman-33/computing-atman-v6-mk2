# Remix における URL 変更とページ遷移の方法まとめ

Remix では、URL を変更したりページを遷移させたりするためにさまざまな方法が提供されています。それぞれの方法は用途や特性が異なるため、適切に選択することで効率的な開発が可能になります。

以下に、主な方法の一覧とその詳細を解説します。

## 方法一覧

| 方法               | クライアント/サーバー | URL変更 | ページ遷移 | サーバー処理      | 主な用途                           |
|--------------------|----------------------|---------|------------|------------------|-----------------------------------|
| `useNavigate`      | クライアント        | 〇       | 〇          | ×                | 単純なページ遷移や URL 変更       |
| `fetcher.load`     | クライアント        | ×       | ×          | 〇 (`loader`)     | 他のページのデータを取得          |
| `fetcher.submit`   | クライアント        | ×       | × (基本的に変更しない) | 〇 (`action`) | サーバーサイド処理を呼び出し、部分的なデータ更新 |
| `redirect`         | サーバー            | 〇       | 〇          | 〇                | サーバーサイド処理後のリダイレクト |
| `<Form>`           | クライアント        | 〇       | 〇          | 〇                | ページ遷移を伴うフォーム送信      |
| `<Link>`           | クライアント        | 〇       | 〇          | ×                | ページ間の自然なリンク            |
| `useSubmit`        | クライアント        | 〇       | 〇          | 〇                | プログラム的にフォーム送信        |
| `window.location`  | クライアント        | 〇       | 〇          | 〇（リロード）    | フルリロードが必要な場合          |
| `useSearchParams`  | クライアント        | 〇       | ×          | ×                | クエリパラメータの更新            |

## 方法の詳細

### `useNavigate`

- **概要**:
  React Router の機能で、プログラム的に URL を変更したりページを遷移させる。
- **特徴**:
  サーバー処理を伴わないため、クライアントサイドでの単純なページ遷移に適している。
- **例**:

  ```tsx
  import { useNavigate } from "@remix-run/react";

  const navigate = useNavigate();

  function handleClick() {
    navigate("/new-page");
  }

  return <button onClick={handleClick}>Go to New Page</button>;
  ```

---

### `fetcher.load`

- **概要**:
  指定した URL の `loader` を呼び出してデータを取得する。
- **特徴**:
  ページ遷移を伴わず、非同期で他のページのデータを取得できる。
- **用途**:
  他のページのデータを取得して UI に反映したい場合。
- **例**:

  ```tsx
  import { useFetcher } from "@remix-run/react";

  const fetcher = useFetcher();

  fetcher.load("/some-data");

  return fetcher.data ? <div>{fetcher.data.message}</div> : <p>Loading...</p>;
  ```

---

### `fetcher.submit`

- **概要**:
  クライアントサイドから `action` をトリガーしてデータ送信を行う。
- **特徴**:
  ページ遷移せずに部分的なデータ更新や処理が可能。
- **用途**:
  サーバー処理を呼び出して UI を更新したい場合。
- **例**:

  ```tsx
  import { useFetcher } from "@remix-run/react";

  const fetcher = useFetcher();

  function handleSubmit() {
    fetcher.submit({ key: "value" }, { method: "post", action: "/some-action" });
  }

  return (
    <>
      <button onClick={handleSubmit}>Submit</button>
      {fetcher.data && <p>Result: {fetcher.data.result}</p>}
    </>
  );
  ```

---

### `redirect`

- **概要**:
  サーバー側で処理を行った後にリダイレクトする。
- **特徴**:
  サーバーサイド処理後にクライアントを別のページに遷移させる場合に使用。
- **例**:

  ```tsx
  import { redirect } from "@remix-run/node";

  export const action = async () => {
    // Some server-side logic
    return redirect("/new-page");
  };
  ```

---

### `<Form>`

- **概要**:
  ページ遷移を伴うフォーム送信を簡単に実装。
- **特徴**:
  サーバー処理とページ遷移を統合的に扱える。
- **例**:

  ```tsx
  <Form method="post" action="/submit">
    <input type="text" name="name" />
    <button type="submit">Submit</button>
  </Form>
  ```

---

### `<Link>`

- **概要**:
  ページ間のリンクを提供。
- **特徴**:
  ユーザーがクリックしてページを遷移するのに適している。
- **例**:

  ```tsx
  import { Link } from "@remix-run/react";

  return <Link to="/new-page">Go to New Page</Link>;
  ```

---

### `useSubmit`

- **概要**:
  プログラム的にフォーム送信を行う。
- **特徴**:
  ページ遷移やサーバー処理を制御可能。
- **例**:

  ```tsx
  import { useSubmit } from "@remix-run/react";

  const submit = useSubmit();

  function handleSubmit() {
    submit({ name: "value" }, { method: "post", action: "/submit" });
  }

  return <button onClick={handleSubmit}>Submit</button>;
  ```

---

### `window.location`

- **概要**:
  フルリロードを伴う URL の変更やページ遷移。
- **特徴**:
  基本的には推奨されないが、特定の状況で必要になる場合がある。
- **例**:

  ```tsx
  window.location.href = "/new-page";
  ```

---

### `useSearchParams`

- **概要**:
  クエリパラメータの取得や変更を行う。
- **特徴**:
  ページをリロードせずにクエリパラメータを操作可能。
- **例**:

  ```tsx
  import { useSearchParams } from "@remix-run/react";

  const [searchParams, setSearchParams] = useSearchParams();

  function updateParam() {
    setSearchParams({ key: "value" });
  }

  return <button onClick={updateParam}>Update Query</button>;
  ```

---

これらの方法を理解し、適切に使い分けることで、より柔軟で効率的な Remix アプリケーションの開発が可能になります。
