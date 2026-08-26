# PromptHub Ecosystem：DeepSeek Harness 插件与 Skill 目录

<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a>
</p>

PromptHub Ecosystem 是一个面向 **DeepSeek Harness（DSH）的插件与 AI Agent Skill 目录插件**。它把 PromptHub 的公开目录接入 DSH Web 设置页，支持搜索、分类、来源链接、作者、Star、兼容性和资源详情查看。

本仓库是 DSH 集成插件的独立分发仓库，不执行第三方代码，也不是 npm 包市场。

## 功能

- **DSH Plugin 目录**：发现 DeepSeek Harness 插件，并复制官方安装命令。
- **AI Skill 目录**：查看社区 Skill、GitHub 源码路径、支持的 Agent 和分发信息。
- **中英文界面**：支持中文和英文界面文案，以及 API 语言切换。
- **搜索筛选**：支持搜索、分类、排序、分页，以及 Plugin/Skill 独立列表。
- **只读安全代理**：提供 DSH 同源代理、HTTPS 地址校验、请求超时、响应大小限制和过期缓存回退。
- **不自动安装**：不会运行 npm、pnpm、Shell 脚本，也不会执行第三方 Plugin 或 Skill 代码。

## 安装

### GitHub 安装

安装固定版本 Tag，便于稳定升级：

```bash
dsh plugin --profile web add github:loiasdi/dsh-prompthub-ecosystem#v0.1.3
```

如需安装最新提交，可以省略 `#v0.1.3`。生产或长期使用建议固定 Release Tag。

### 本地安装包

从 [v0.1.3 Release](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases/tag/v0.1.3) 下载 `.tgz`，也可以从本地仓库构建：

```bash
npm run pack:local
```

打包文件会写入 `dist/prompthub-dsh-ecosystem-<version>.tgz`，使用绝对路径安装：

```bash
dsh plugin --profile web add /absolute/path/prompthub-dsh-ecosystem-0.1.3.tgz
```

本地安装包可以复制到其他机器，目标机器不需要访问 GitHub。

### 本地开发链接

```bash
dsh plugin --profile web add link:/absolute/path/to/dsh-prompthub-ecosystem
```

安装、升级或移除后，请重启 DSH Web Profile。

### 升级与移除

```bash
dsh plugin --profile web add github:loiasdi/dsh-prompthub-ecosystem#v0.1.3
dsh plugin --profile web remove prompthub-dsh-ecosystem
```

本地安装包升级时，使用新版本 `.tgz` 的路径重新执行 `add`。

## 环境要求

- DeepSeek Harness CLI，并使用 `web` Profile。
- Node.js `^22.19.0` 或 `>=24.0.0`。
- `pnpm` 已加入 `PATH`，当前 DSH 工作区使用 pnpm `11.7.0`。
- GitHub 安装需要访问 GitHub，本地 `.tgz` 安装不需要。
- 插件运行在 DSH Web 客户端中（`dsh.client.platform = web`）。
- 浏览公开 PromptHub 目录不需要数据库、API Key 或 PromptHub 登录；只有离开目录进入受保护操作时才需要登录。

## 安全边界

PromptHub Ecosystem 只通过 PromptHub API 读取公开目录数据。它不会读取 DSH 凭据、保存 PromptHub 密码、修改 Profile、上传本地文件、安装资源或执行第三方代码。外部链接仅允许 HTTPS，并交给用户的正常浏览器流程处理。

## 配置

`cordis.patch.yml` 支持以下配置：

- `apiBaseUrl`：PromptHub API 地址和 `/api` 前缀。
- `requestTimeoutMs`：上游请求超时时间。
- `cacheTtlMs`：内存新鲜缓存时长。

默认 API 地址为 `https://prompthub.xin/api`。

## 开发

```bash
npm test
node --check index.js
node --check client.js
npm run pack:local
```

打包脚本会自动执行测试、语法检查、归档内容检查，并输出文件大小和 SHA-256。如果 GitHub 源码包包含 `prepare` 构建脚本，在 pnpm 10+ 中可能需要在目标 Profile 的 `pnpm-workspace.yaml` 配置 `allowBuilds`；本插件没有 `prepare` 步骤。

## 相关链接

- [PromptHub](https://prompthub.xin)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- [Release 与本地安装包](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases)

## 许可证

当前仓库以未发布的私有 npm 包（`private: true`）形式存在，仅通过 GitHub 和本地 `.tgz` 文件分发。PromptHub 收录的第三方资源遵循其原始许可证。
