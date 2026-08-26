# PromptHub Ecosystem for DeepSeek Harness | DSH Plugins & Skills

<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a>
</p>

PromptHub Ecosystem is a **DeepSeek Harness (DSH) plugin catalog** for discovering DSH plugins and AI agent skills. It adds a read-only PromptHub directory to DSH Web Settings with search, categories, source links, author and Star metadata, compatibility details, and resource details.

This repository is the standalone distribution repository for the DSH integration. It is not a third-party code executor or an npm package registry.

## Features

- **DSH Plugin catalog**: discover DeepSeek Harness plugins and copy their official installation command.
- **AI Skill directory**: browse community skills, GitHub source paths, supported agents, and distribution information.
- **Bilingual UI**: Chinese and English interface strings and API locale selection.
- **Search and filters**: search, category, sort, pagination, and separate Plugin/Skill views.
- **Safe read-only proxy**: same-origin DSH host route, HTTPS source URL validation, request timeout, response-size limit, and stale-cache fallback.
- **No automatic installation**: the catalog never runs npm, pnpm, shell scripts, or third-party Plugin/Skill code.

## Installation

### GitHub installation

Install a fixed release tag for predictable upgrades:

```bash
dsh plugin --profile web add github:loiasdi/dsh-prompthub-ecosystem#v0.1.3
```

For the latest committed version, omit `#v0.1.3`. Pinning a release tag is recommended for production-like environments.

### Local package installation

Download the `.tgz` asset from the [v0.1.3 Release](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases/tag/v0.1.3), or build it from a checkout:

```bash
npm run pack:local
```

The package is written to `dist/prompthub-dsh-ecosystem-<version>.tgz`. Install it with an absolute path:

```bash
dsh plugin --profile web add /absolute/path/prompthub-dsh-ecosystem-0.1.3.tgz
```

The package can be copied to another machine; GitHub access is not required on that machine.

### Development link

```bash
dsh plugin --profile web add link:/absolute/path/to/dsh-prompthub-ecosystem
```

Restart the DSH Web profile after installation, upgrade, or removal.

### Upgrade and removal

```bash
dsh plugin --profile web add github:loiasdi/dsh-prompthub-ecosystem#v0.1.3
dsh plugin --profile web remove prompthub-dsh-ecosystem
```

For local packages, run `add` again with the path to the new `.tgz` file.

## Requirements

- DeepSeek Harness CLI with the `web` profile.
- Node.js `^22.19.0` or `>=24.0.0`.
- `pnpm` available on `PATH`; the current DSH workspace uses pnpm `11.7.0`.
- GitHub installation needs GitHub network access; local `.tgz` installation does not.
- The plugin runs in the DSH Web client (`dsh.client.platform = web`).
- The public PromptHub catalog does not require a database, API key, or PromptHub login. Login is only needed for actions protected by PromptHub after leaving the catalog.

## Security

PromptHub Ecosystem only reads public catalog data through the PromptHub API. It does not read DSH credentials, store PromptHub passwords, modify profiles, upload local files, install resources, or execute third-party code. External links are restricted to HTTPS and open in the user's normal browser flow.

## Configuration

The bundle configuration in `cordis.patch.yml` supports:

- `apiBaseUrl`: PromptHub API origin and `/api` prefix.
- `requestTimeoutMs`: upstream request timeout.
- `cacheTtlMs`: in-memory fresh-cache lifetime.

The default API endpoint is `https://prompthub.xin/api`.

## Development

```bash
npm test
node --check index.js
node --check client.js
npm run pack:local
```

The packaging script runs tests, syntax checks, archive inspection, and prints the package size and SHA-256. GitHub source packages with a `prepare` build script may require a pnpm 10+ `allowBuilds` entry in the target Profile's `pnpm-workspace.yaml`; this package has no `prepare` step.

## Links

- [PromptHub](https://prompthub.xin)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- [Releases and local packages](https://github.com/loiasdi/dsh-prompthub-ecosystem/releases)

## License

This repository is currently distributed as an unpublished, private npm package (`private: true`) through GitHub and local `.tgz` artifacts. Third-party resources listed by PromptHub retain their original licenses.
