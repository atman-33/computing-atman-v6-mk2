# Remix を VSCode でデバッグする方法

## 参考URL

- [Remix を Visual Studio Code 上でデバッグする(フロントエンドとバックエンド両方)](https://zenn.dev/onozaty/articles/remix-vscode-debug)

## ステップ

### launch.jsonを作成

`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "cwd": "${workspaceFolder}"
    },
    {
      "name": "Debug Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000/",
      "webRoot": "${workspaceFolder}/app",
      "sourceMaps": true
    },
    {
      "name": "Debug Backend and Frontend",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "cwd": "${workspaceFolder}",
      "serverReadyAction": {
        "action": "startDebugging",
        "pattern": "Local: +https?://.+",
        "name": "Debug Frontend"
      }
    },
  ]
}
```
