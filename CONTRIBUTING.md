# 贡献指南

感谢关注 dsh-theme-kit。欢迎通过以下方式参与：

## 反馈

- 功能建议 / 想法：到 [Discussions](https://github.com/ink5897/dsh-theme-kit/discussions) 发帖
- Bug 报告：到 [Issues](https://github.com/ink5897/dsh-theme-kit/issues) 提交，尽量附上复现步骤与截图

## 提交 PR

1. Fork 本仓库，基于 `main` 新建分支
2. 修改代码；提交信息遵循 Conventional Commits（`feat:` / `fix:` / `docs:` / `chore:`）
3. 推送并提 PR，说明改了什么、为什么

## 本地开发

```bash
git clone https://github.com/ink5897/dsh-theme-kit.git
cd dsh-theme-kit
dsh plugin --profile web add link:.
```

- 改 `lib/client.js`：刷新页面即可生效
- 改 `lib/index.js`：需重启 `dsh web`
- 壁纸与纹理资产在 `wallpapers/`，由宿主路由 `/dsh-theme-kit-wallpapers` 提供
