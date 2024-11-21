# focus時の枠線が消えない

shadcnuiコンポーネントのfocus時の枠線が消えない時の対処方法

## Buttonの場合

`focus:!ring-transparent`を付与する。

e.g.

```tsx
<Button variant="ghost" className="focus:!ring-transparent">
```

## DropdownMenuTriggerの場合

`focus:!outline-note`を付与する。

e.g.

```tsx
<DropdownMenuTrigger className="focus:!outline-none">
```
