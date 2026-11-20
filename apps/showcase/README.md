# Showcase

A small Vite + React + Tailwind v4 app that uses Max Core the way any other project would.
It installs the **published** `@max-core-ds/react` and `@max-core-ds/tokens` from GitHub
Packages, not the code in `packages/`. It's a **template consumer**: it follows
[`docs/template-usage.md`](../../docs/template-usage.md) to the letter and builds its token CSS
from its own `tokens/tokens.json`, like a project with its own brand would. Install, `.npmrc`
and Inter (`@fontsource/inter`) are as in [`docs/consuming.md`](../../docs/consuming.md).

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

## Where the tokens come from

- `tokens/tokens.json` is a committed copy of our tokens **at the released version the showcase
  installs**, taken from the release tag (`git show v<version>:packages/tokens/src/tokens.json`).
  It stands in for the file a template team's Figma plugin would publish from their own Figma
  copy. It comes from the tag, not `main`: `main` can hold unreleased token changes that don't
  match the released components.
- `pnpm tokens` runs `max-core-tokens build --input tokens/tokens.json --out src/styles/brand`.
  The CLI comes from the installed `@max-core-ds/tokens`. It writes `tokens.css` + `theme.css`
  and runs the **contract check**: if a variable the installed `@max-core-ds/react` reads is
  missing, it lists it and stops.
- `dev` and `build` run `pnpm tokens` first. `src/styles/brand/` is generated and gitignored.
- `src/styles.css` imports `./styles/brand/tokens.css` + `./styles/brand/theme.css` instead of
  the package's ready-made files.

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
`pnpm build`. It checks that our own packages work for an outside project. Because `build` runs
`pnpm tokens` first, the job also exercises the `max-core-tokens` CLI and the contract check.

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

On a branch:

```bash
pnpm -C apps/showcase update '@max-core-ds/*@<version>'
git show v<version>:packages/tokens/src/tokens.json > apps/showcase/tokens/tokens.json
pnpm showcase    # regenerates the CSS; check light + dark render styled
```

Then commit `apps/showcase/package.json`, `apps/showcase/pnpm-lock.yaml` and
`apps/showcase/tokens/tokens.json`. This is step D
of the [release workflow](../../README.md#release-workflow).
