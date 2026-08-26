# PromptHub Ecosystem for DeepSeek Harness

PromptHub Ecosystem adds a read-only PromptHub directory to DeepSeek Harness Settings. It provides separate DSH Plugin and Skill lists with search, category filters, details, source metadata, and local stale-cache fallback.

## Distribution

Only two installation methods are supported:

1. GitHub source installation, for users who can access GitHub.
2. A locally distributed `.tgz` package, for offline or controlled distribution.

The package is intentionally `private` and is not published to npm. The GitHub repository or the `.tgz` file is the distribution artifact.

### Install from GitHub

Install a fixed release tag from the standalone repository:

```bash
dsh plugin --profile web add github:loiasdi/dsh-prompthub-ecosystem#v0.1.0
```

For the latest committed version during development, omit the tag. Pinning a tag is recommended for production use.

The current checkout can also be installed for development with a local link, but that is not a release installation:

```bash
dsh plugin --profile web add link:/absolute/path/to/dsh-prompthub-ecosystem
```

### Build and install a local package

From the standalone repository root:

```bash
cd dsh-prompthub-ecosystem
npm run pack:local
```

The script runs the tests and syntax checks, creates `dist/prompthub-dsh-ecosystem-<version>.tgz`, prints its size and SHA-256, and rejects archives containing environment files, keys, or test fixtures. Install the resulting absolute path into the target profile:

```bash
dsh plugin --profile web add /absolute/path/to/prompthub-dsh-ecosystem-0.1.0.tgz
```

Copying this file to another machine is sufficient; the target machine does not need GitHub access.

### Upgrade, remove, and restart

```bash
dsh plugin --profile web update prompthub-dsh-ecosystem
dsh plugin --profile web remove prompthub-dsh-ecosystem
```

Restart the Web profile after installation, upgrade, or removal, then open Settings and select **PromptHub**. The install command changes the selected profile only; it does not install anything into PromptHub itself.

## Environment requirements

- DeepSeek Harness CLI with the `web` profile.
- Node.js `^22.19.0` or `>=24.0.0` (the current DSH requirement), with `pnpm` available on `PATH` (the current DSH workspace uses pnpm `11.7.0`).
- GitHub installation requires network access to GitHub. Local `.tgz` installation does not.
- The plugin must run in a DSH Web client (`dsh.client.platform = web`).
- A GitHub source package that has a `prepare` build script may require the profile's `pnpm-workspace.yaml` `allowBuilds` entry under pnpm 10+. This package currently has no prepare step; a built `.tgz` also does not require that allowance.

The plugin itself does not require a separate database, API key, or PromptHub login to display the public catalog. It calls the public PromptHub API over HTTPS. Login is only needed when the user follows an action that PromptHub protects.

## Security

This plugin does not execute or install third-party code, modify profiles, read credentials, or store PromptHub passwords. The host half only proxies public read requests to the configured PromptHub API. External actions open PromptHub resource pages, where PromptHub applies its own login policy.

## Configuration

The bundle config in `cordis.patch.yml` supports:

- `apiBaseUrl`: PromptHub API origin and `/api` prefix.
- `requestTimeoutMs`: upstream request timeout.
- `cacheTtlMs`: in-memory fresh-cache lifetime.
