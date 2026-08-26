# PromptHub Ecosystem for DeepSeek Harness | DSH Plugins & Skills

PromptHub Ecosystem is a **DeepSeek Harness (DSH) plugin catalog** for discovering DSH plugins and AI agent skills. It adds a read-only PromptHub directory to DSH Web Settings with search, categories, bilingual descriptions, source links, author and Star metadata, compatibility details, and resource details.

PromptHub Ecosystem 是一个面向 **DeepSeek Harness（DSH）的插件与 Skill 目录插件**。它把 PromptHub 的公开目录接入 DSH Web 设置页，支持搜索、分类、中英文描述、来源链接、作者、Star、兼容性和详情查看。

This repository is the standalone distribution repository for the DSH integration. It is not a third-party code executor or an npm package registry.

本仓库是 DSH 集成插件的独立分发仓库，不执行第三方代码，也不是 npm 包市场。

## Features | 功能

- **DSH Plugin catalog**: discover DeepSeek Harness plugins and copy their official installation command.
- **AI Skill directory**: browse community skills, GitHub source paths, supported agents, and distribution information.
- **Bilingual UI**: Chinese and English interface strings and API locale selection.
- **Search and filters**: search, category, sort, pagination, and separate Plugin/Skill views.
- **Safe read-only proxy**: same-origin DSH host route, HTTPS source URL validation, request timeout, response-size limit, and stale-cache fallback.
- **No automatic installation**: the catalog never runs npm, pnpm, shell scripts, or third-party Plugin/Skill code.

- **DSH Plugin 目录**：发现 DeepSeek Harness 插件，并复制官方安装命令。
- **AI Skill 目录**：查看社区 Skill、GitHub 源码路径、支持的 Agent 和分发信息。
- **中英文界面**：支持中文和英文文案，以及 API 语言切换。
- **搜索筛选**：支持搜索、分类、排序、分页，以及 Plugin/Skill 独立列表。
- **只读安全代理**：提供 DSH 同源代理、HTTPS 地址校验、超时、响应大小限制和过期缓存回退。
- **不自动安装**：不会运行 npm、pnpm、Shell 脚本，也不会执行第三方 Plugin 或 Skill 代码。

## Installation | 安装

### GitHub installation | GitHub 安装

Install a fixed release tag for predictable upgrades:

安装固定版本 Tag，便于稳定升级：

```bash
dsh plugin --profile web add github:loiasdi/dsh-prompthub-ecosystem#v0.1.0
```

For the latest committed version, omit `#v0.1.0`. Pinning a release tag is recommended for production-like environments.

如需安装最新提交，可以省略 `#v0.1.0`。生产或长期使用建议固定 Release Tag。

### Local package installation | 本地安装包

Download the `.tgz` asset from the [v0.1.1 Release](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases/tag/v0.1.1), or build it from a checkout:

从 [v0.1.1 Release](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases/tag/v0.1.1) 下载 `.tgz`，也可以从本地仓库构建：

```bash
npm run pack:local
```

The package is written to `dist/prompthub-dsh-ecosystem-<version>.tgz`. Install it with an absolute path:

打包文件会写入 `dist/prompthub-dsh-ecosystem-<version>.tgz`，使用绝对路径安装：

```bash
dsh plugin --profile web add /absolute/path/prompthub-dsh-ecosystem-0.1.1.tgz
```

The package can be copied to another machine; GitHub access is not required on that machine.

本地安装包可以复制到其他机器，目标机器不需要访问 GitHub。

### Development link | 本地开发链接

```bash
dsh plugin --profile web add link:/absolute/path/to/dsh-prompthub-ecosystem
```

Restart the DSH Web profile after installation, upgrade, or removal.

安装、升级或移除后，请重启 DSH Web Profile。

### Upgrade and removal | 升级与移除

```bash
dsh plugin --profile web update prompthub-dsh-ecosystem
dsh plugin --profile web remove prompthub-dsh-ecosystem
```

## Requirements | 环境要求

- DeepSeek Harness CLI with the `web` profile.
- Node.js `^22.19.0` or `>=24.0.0`.
- `pnpm` available on `PATH`; the current DSH workspace uses pnpm `11.7.0`.
- GitHub installation needs GitHub network access; local `.tgz` installation does not.
- The plugin runs in the DSH Web client (`dsh.client.platform = web`).
- The public PromptHub catalog does not require a database, API key, or PromptHub login. Login is only needed for actions protected by PromptHub after leaving the catalog.

- DeepSeek Harness CLI，并使用 `web` Profile。
- Node.js `^22.19.0` 或 `>=24.0.0`。
- `pnpm` 已加入 `PATH`，当前 DSH 工作区使用 pnpm `11.7.0`。
- GitHub 安装需要访问 GitHub，本地 `.tgz` 安装不需要。
- 插件运行在 DSH Web 客户端中（`dsh.client.platform = web`）。
- 浏览公开 PromptHub 目录不需要数据库、API Key 或 PromptHub 登录；只有离开目录进入受保护操作时才需要登录。

## Security | 安全边界

PromptHub Ecosystem only reads public catalog data through the PromptHub API. It does not read DSH credentials, store PromptHub passwords, modify profiles, upload local files, install resources, or execute third-party code. External links are restricted to HTTPS and open in the user's normal browser flow.

PromptHub Ecosystem 只通过 PromptHub API 读取公开目录数据。它不会读取 DSH 凭据、保存 PromptHub 密码、修改 Profile、上传本地文件、安装资源或执行第三方代码。外部链接仅允许 HTTPS，并交给用户的正常浏览器流程处理。

## Configuration | 配置

The bundle configuration in `cordis.patch.yml` supports:

`cordis.patch.yml` 支持以下配置：

- `apiBaseUrl`: PromptHub API origin and `/api` prefix. PromptHub API 地址和 `/api` 前缀。
- `requestTimeoutMs`: upstream request timeout. 上游请求超时时间。
- `cacheTtlMs`: in-memory fresh-cache lifetime. 内存新鲜缓存时长。

The default API endpoint is `https://prompthub.xin/api`.

默认 API 地址为 `https://prompthub.xin/api`。

## Development | 开发

Run the plugin tests and syntax checks:

运行测试和 JavaScript 语法检查：

```bash
npm test
node --check index.js
node --check client.js
```

Build a distributable local package with tests, syntax checks, archive inspection, file size, and SHA-256 output:

构建本地分发包时，会自动执行测试、语法检查、归档内容检查，并输出文件大小和 SHA-256：

```bash
npm run pack:local
```

GitHub source packages that contain a `prepare` build script may require a pnpm 10+ `allowBuilds` entry in the target Profile's `pnpm-workspace.yaml`. This package has no `prepare` step, and the built tarball does not require that allowance.

如果 GitHub 源码包包含 `prepare` 构建脚本，在 pnpm 10+ 中可能需要在目标 Profile 的 `pnpm-workspace.yaml` 配置 `allowBuilds`。本插件没有 `prepare` 步骤，已构建的 tarball 也不需要该配置。

## Links | 相关链接

- [PromptHub](https://prompthub.xin)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- [Releases and local packages](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases)
- [PromptHub DSH ecosystem architecture](https://github.com/loiasdi/prompthub/blob/main/docs/architecture/PromptHub-DSH生态目录插件方案.md)

## License | 许可证

This repository is currently distributed as an unpublished, private npm package (`private: true`) through GitHub and local `.tgz` artifacts. Third-party resources listed by PromptHub retain their original licenses.

当前仓库以未发布的私有 npm 包（`private: true`）形式存在，仅通过 GitHub 和本地 `.tgz` 文件分发。PromptHub 收录的第三方资源遵循其原始许可证。
