# Gitコマンド

## 直前のコミット取り消し

```sh
git reset --soft HEAD~
```

> HEAD~: 直前のコミット
> HEAD~{n} ：n個前のコミット

## ブランチ一覧

```sh
git branch
```

終了するときは`q`ボタンを押す。

## ローカルブランチ削除

```sh
git branch -d {ブランチ名}  // 削除（マージ確認あり）
git branch -D {ブランチ名}  // 削除（マージ確認なし）
```
