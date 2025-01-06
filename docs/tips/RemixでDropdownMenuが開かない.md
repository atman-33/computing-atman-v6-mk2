# RemixでDropdownMenuが開かない

DropdownMenuTriggerのプロパティに`asChaild`を指定すると、画面に描写されなくなる。

```tsx
// NG
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  // ...

// OK
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  // ...
```
