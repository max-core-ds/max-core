# Showcase

A small Vite + React + Tailwind v4 app that uses Max Core the way any other project would.
It installs the **published** `@max-core-ds/react` and `@max-core-ds/tokens` from GitHub
Packages, not the code in `packages/`, and follows [`docs/consuming.md`](../../docs/consuming.md)
to the letter (`.npmrc`, CSS imports in `src/styles.css`, Inter via `@fontsource/inter`).

It's our first consumer: if a release is broken for outside projects (a missing file, a wrong
`exports` path, broken types, classes Tailwind can't find), it breaks here first.

## How it's set up

The showcase lives in this repo but is **its own pnpm project**:

- The root `pnpm-workspace.yaml` excludes `apps/showcase`. A root `pnpm install` doesn't touch
  it and needs no token.
- `apps/showcase/pnpm-workspace.yaml` makes this folder its own pnpm root. It allows new
  `@max-core-ds/*` releases to install right away (pnpm otherwise holds back fresh versions).
- `.npmrc` points `@max-core-ds` at GitHub Packages and reads `GITHUB_PACKAGES_TOKEN`.
- It has its own `pnpm-lock.yaml` and a self-contained `tsconfig.json`.

## Run it

Installing needs a classic token with `read:packages`. The release token (`write:packages`)
works too.

```bash
read -rs GITHUB_PACKAGES_TOKEN && export GITHUB_PACKAGES_TOKEN
pnpm -C apps/showcase install      # first time, and after a version bump
pnpm showcase                      # dev server (from the repo root)
```

Dev and build don't need the token. Without it, pnpm prints
`[WARN] Failed to replace env in config: ${GITHUB_PACKAGES_TOKEN}`, which is harmless.

## The `showcase` CI job

`.github/workflows/ci.yml` has a separate `showcase` job that runs on every PR and push to
`main`: `pnpm install --frozen-lockfile` from GitHub Packages, then `pnpm typecheck` and
`pnpm build`. It checks that our own packages work for an outside project.

- **This check belongs to us, not to consumers.** Projects that use Max Core don't copy this
  job. Their normal CI installs the packages like any other dependency; the only Max Core
  setup they need is the `.npmrc` and read token from `docs/consuming.md`.
- It tests the **published** version in the lockfile, not the PR's code. The `ci` job covers
  the workspace code; this job confirms the last release works.
- It authenticates with the built-in `GITHUB_TOKEN` (`packages: read`). For that, this repo
  must be listed under **Manage Actions access** on both packages, with Read or higher.
- It doesn't render anything. Check that the components look styled by eye after a bump.
- It's not a required check. A red `showcase` job means a release is broken: fix it in the
  package and ship a patch, never with a workaround here.

## After each release

```bash
pnpm -C apps/showcase update '@max-core-ds/*@<version>'
pnpm showcase    # check light + dark render styled
```

Then commit `apps/showcase/package.json` and `apps/showcase/pnpm-lock.yaml`. This is step D
of the [release workflow](../../README.md#release-workflow).
