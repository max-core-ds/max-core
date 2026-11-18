# Max Core

A React design system driven by Figma variables: **55 components** built on Base UI +
Tailwind v4, reading every size, colour, type style and effect from tokens that the designer
owns in Figma.

**Designer changes a variable in Figma → plugin opens a pull request → CI checks it → a
release publishes `@max-core-ds/tokens` + `@max-core-ds/react` → projects update.** No code edits
for token changes.

- **Use it in a project:** [`docs/consuming.md`](docs/consuming.md)
- **Use it as a template** (same components, your own brand in your own Figma copy):
  [`docs/template-usage.md`](docs/template-usage.md)
- **Ship changes:** [Release workflow](#release-workflow) below

---

## Quick start

```bash
# Install all workspace dependencies
pnpm install

# Generate tokens.css from tokens.json
pnpm -F @max-core-ds/tokens build

# Open Storybook (component workshop)
pnpm storybook

# Full build (all packages + storybook static site)
pnpm build
```

The demo app `apps/showcase` installs the **published** packages, so it has its own install
(needs `GITHUB_PACKAGES_TOKEN`): see [`apps/showcase/README.md`](apps/showcase/README.md).

---

## Project structure

```
max-core/
├── CLAUDE.md                         # Agent guardrails and project rules
├── PLAN.md                           # Phase-by-phase implementation plan
├── PROGRESS.md                       # Live component + cross-check status
├── .github/workflows/ci.yml          # CI: build, typecheck, lint, drift, tests, showcase + token diff
├── .changeset/                       # Pending changesets (next release)
├── scripts/release.mjs               # pnpm release
├── docs/
│   ├── consuming.md                  # Install + use the packages in a project
│   ├── template-usage.md             # Own brand on the Max Core components
│   ├── MAX-CORE-SUMMARY.md           # System specification
│   ├── CLAUDE-ARCHIVE.md             # Historical component QA notes
│   └── max-core-business-plan.md     # Product strategy
├── prompts/                          # Reusable handoff / authoring guides
│   ├── component-audit.md            # Continue the Figma component audit
│   └── implement-component.md        # Build a new component + story
├── packages/
│   ├── tokens/                       # @max-core-ds/tokens
│   ├── react/                        # @max-core-ds/react
│   └── figma-plugin/                 # @max-core-ds/figma-plugin
├── apps/
│   ├── storybook/                    # Storybook 10 component workshop (private)
│   └── showcase/                     # Demo app on the published packages (own pnpm root)
├── package.json                      # Workspace root scripts
├── pnpm-workspace.yaml               # Workspace package paths (excludes apps/showcase)
├── turbo.json                        # Task orchestration
├── biome.json                        # Lint + format
└── tsconfig.base.json                # Shared TypeScript config
```

---

## Packages

### `@max-core-ds/tokens`

**What it is.** The token source of truth + the build pipeline that turns it
into something usable.

**What's inside.**

- `src/tokens.json` — the canonical token data exported from Figma: primitives, semantics,
  light/dark colours, ~750 component tokens, 15 text styles, 20 effect styles.
- `src/transform.ts` — token tree → `tokens.css` (CSS variables, `:root` +
  `[data-theme="dark"]`, component vars as `var()` chains) and `theme.css` (Tailwind v4
  layer: `type-*` text styles with cap-height trim, `glass-*`, shadows, fonts, breakpoints).
- `src/cli.ts` — the `max-core-tokens` CLI: `build` (this repo, or `--input/--out` for a
  template project) and `check` (the token contract).
- `src/contract.ts` — `contract.json`: every token var `@max-core-ds/react` reads.
- `src/sync.ts` — pulls a downloaded plugin export into `src/tokens.json` (manual fallback).
- `src/diff.ts` — the token diff used by `sync`, the CI PR comment and the Figma plugin.
- `src/drift.ts` / `src/contrast-audit.ts` — guardrails: components bind their own Figma
  tokens and no unknown vars (blocking in CI); WCAG AA text/background pairs (report only).
- `src/types.ts` — the `TokensFile` shape, shared with the Figma plugin.

**Ships** `tokens.css`, `theme.css`, `scrollbar.css`, `tokens.json`, `contract.json`, types and
the `max-core-tokens` bin.

**Commands (in this repo).**

```bash
pnpm -F @max-core-ds/tokens build                   # tokens.json → dist/ (CSS + contract)
pnpm -F @max-core-ds/tokens drift                   # react ↔ Figma token conformance
pnpm -F @max-core-ds/tokens contrast                # WCAG AA report
pnpm -F @max-core-ds/tokens diff --base old.json    # token diff vs another tokens.json
pnpm -F @max-core-ds/tokens sync --input <file> [--dry-run]   # manual import of an export
```

`tokens.json` is **committed**: it's the source of the build, and every change to it arrives
as a reviewed PR.

---

### `@max-core-ds/react`

**What it is.** The React component library — 55 components across atoms,
molecules, and organisms. All are typed, built (tsup), and drift-green against
their Figma token spec. Consumers import `@max-core-ds/react/styles.css` so their Tailwind
emits the components' classes (see [`docs/consuming.md`](docs/consuming.md)).

**What's inside.** A representative slice:

- `src/components/Button` — 3 variants × 4 tones × 4 sizes, with optional
  left/right icons. Built on Base UI's `Button` primitive.
- `src/components/Badge` — Default/Outline/Ghost variants × tones × 3 sizes.
- `src/components/Input` — 3 sizes, with label / helper / error states. Base
  UI `Field` + `Input`.
- …plus selection controls, navigation (Tabs, Pagination, Top/Side/Bottom
  bars), overlays (Dialog, Dropdown, Toast), and more.
- `src/utils/` — shared helpers (`cn`, `focus-ring`, `tone`, `state-layer`,
  `validation`, …) that keep Tailwind literals in one place.

> **The full, live inventory lives in [`PROGRESS.md`](PROGRESS.md)** — it lists
> every component, its Storybook title, and its Figma cross-check status.

**How consumers use it.**

```tsx
import { Button, Avatar, Input } from '@max-core-ds/react';
import { Plus } from 'lucide-react';

<Button variant="primary" tone="danger" size="l" leftIcon={<Plus size={20} />}>
  Add user
</Button>
<Avatar src={src} fallback="JD" size="m" />
<Input label="Email" placeholder="you@example.com" />
```

**What you'll need on the consumer side.**

1. **Tailwind v4**, pointed at the library so it emits our classes. The
   components are arbitrary-value utilities (`h-[var(--size-40)]`), and
   Tailwind only generates a class it can *see* in scanned source — so add an
   `@source` directive covering the built library:

   ```css
   @import 'tailwindcss';
   @source '../node_modules/@max-core-ds/react/dist/**/*.js';
   @import '@max-core-ds/tokens/tokens.css';   /* after Tailwind — see below */
   ```

   Tailwind isn't optional: `var()` support resolves the token *values*, but
   something still has to generate the utility classes that reference them.
2. **Import `@max-core-ds/tokens/tokens.css`** in your global CSS entry, *after*
   Tailwind, so its `:root` definitions win on any shared variable names
   (e.g. `--radius-md`). Without this import the `var(--…)` references resolve
   to nothing and components render unstyled.
3. **React 18+** — it's a peer dependency (`react`, `react-dom` `>=18`).
4. **Your own icon library** — components accept `ReactNode` for `leftIcon` /
   `rightIcon`. We don't bundle icons; Storybook uses `lucide-react` (matches
   the Figma file).

**Variants are CVA-driven.** Each component uses `class-variance-authority`
for variant matrices. Adding a new variant is a few lines in the `cva()`
call.

**Adopting it before it's finished.** The library is usable for real work
today — you don't have to wait for every component. Once the Tailwind + token
wiring above is in place, import what you need. Every shipped component has been
audited against its Figma master (Phase 4.5, per-page notes in
[`docs/audit/`](docs/audit/), status in [`PROGRESS.md`](PROGRESS.md)). Expect
visual tweaks while the designer list is worked through, and note the deferred
pieces (some Stacked List row types, Data Table mobile / expandable rows, four
Bottom Sheet premades). Behaviour and accessibility tests run in CI (see
[Testing](#testing)).

Because it's a workspace package at `0.0.0` (not published to npm), "consume"
today means inside this monorepo, via `pnpm link`, or from a tarball — not a
public `npm install`.

**Build.**

```bash
pnpm -F @max-core-ds/react build
# → dist/index.js (ESM), dist/index.cjs (CJS), dist/index.d.ts (types), dist/styles.css
```

---

### `@max-core-ds/figma-plugin`

**What it is.** The Figma desktop plugin (**Max Core Tokens**) that exports the file's
variables, text styles and effect styles as `tokens.json`, and publishes them to GitHub.
Private: built from this repo, not published to the registry. Its header shows the package
version it matches.

**Why a plugin.** The Figma REST API for variables needs an Enterprise plan; the Plugin API
works on any plan.

**What's inside.**

- `src/transform.ts` — Figma Plugin API → `TokensFile` (all four collections in the
  `Max core` mode, alias chains kept to the nearest token, text + effect styles).
- `src/code.ts` — sandbox side: runs the export, stores settings in `figma.clientStorage`.
- `src/ui.ts` + `src/ui.html` — the panel (bundled and inlined into `dist/ui.html`).
- `src/github.ts` — Publish: diff vs the base branch → branch → commit `tokens.json` (+ a
  changeset) → pull request.

**Install (Figma desktop).**

1. `pnpm -F @max-core-ds/figma-plugin build`
2. **Plugins → Development → Import plugin from manifest…** →
   `packages/figma-plugin/manifest.json`. Re-import after a manifest change; after code
   changes, rebuilding and re-running is enough.
3. Open **Settings** in the plugin and add a fine-grained GitHub token (only
   `max-core-ds/max-core`, Contents + Pull requests: Read and write). Defaults point at this
   repo; template projects change owner/repo/path.

**Use.** **Publish to GitHub** previews the changes ("Already up to date" if none), then opens
a PR with the token diff. **Download** saves `tokens.json` instead (manual fallback, see
below). Development plugins need edit access to the file.

---

### `apps/storybook`

**What it is.** A Storybook 10 app for browsing and stress-testing components.

**What's inside.**

- `.storybook/main.ts` — framework config (React + Vite), addon list.
- `.storybook/preview.tsx` — global decorators including the dark-mode
  toggle. Imports `src/global.css`.
- `src/global.css` — the same CSS block a consumer uses (`@max-core-ds/react/styles.css`,
  `tokens.css`, `theme.css`); Storybook runs the built `@max-core-ds/react` (`pnpm -F
  @max-core-ds/react dev` to watch).
- `src/stories/` — one stories file per atom + a Foundations / Tokens story
  with color, spacing, and radius reference swatches.
- `vite.config.ts` — wires the Tailwind v4 Vite plugin.

**How to use it.**

```bash
# Dev server with hot reload
pnpm storybook
# → http://localhost:6006

# Static build (for deployment)
pnpm -F @max-core-ds/storybook build
# → apps/storybook/storybook-static/
```

**The Foundations / Tokens story** is the canonical visual reference for the
token system. Toggle dark mode (top toolbar) to verify the cascade swaps
correctly across colors, then look at the spacing scale and radius scale
ramps.

**Storybook is not shipped to consumers.** It's a dev workshop. If you want
to publish it as documentation, build the static site and deploy to GitHub
Pages, Netlify, etc.

---

## Release workflow

Two ways a change starts; both end in the same release. Only released versions reach other
projects; pushing to `main` alone publishes nothing.

### A. Token change (designer, in Figma)

1. Edit variables or styles in the Figma file (`Max core` mode).
2. Plugin → **Publish to GitHub**, optionally with a note. It compares the export with
   `tokens.json` on `main` and, if anything changed, creates a `figma/tokens-<date>` branch,
   commits `tokens.json` plus a changeset (**patch**, or **minor** when tokens were removed)
   and opens a PR.
3. CI on the PR:
   - **`ci` check** (required): build, typecheck, lint and **drift** — red if a token the
     components use was removed or renamed;
   - a **token diff comment** (added / removed / changed, per section);
   - a **contrast report** in the run summary (never blocks);
   - a **`showcase` check** (not required): installs the *published* packages into
     `apps/showcase` and builds it, so a broken release shows up here
     ([details](apps/showcase/README.md#the-showcase-ci-job)).
4. Review and merge. **Green:** merge. **Red:** the designer fixes it in Figma and publishes
   again (the PR updates), or a developer adapts the components on the same branch.

### B. Code change (developer)

1. Change the components or the token tooling.
2. `pnpm changeset`: pick both packages, **patch** (fix) or **minor** (new component or prop,
   anything breaking), one line for the changelog. Name added/renamed tokens.
3. Push to `main` or merge a PR once `ci` is green.

### C. Release (developer, locally, whenever)

Pending changesets pile up; one release turns all of them into one version.

```bash
git pull
read -rs GITHUB_PACKAGES_TOKEN && export GITHUB_PACKAGES_TOKEN   # classic token, write:packages
pnpm release                         # version + changelogs → CI checks (incl. tests) → commit → publish → tag
git push --follow-tags origin main
```

`pnpm release --publish-only` retries a failed publish. Published versions can't be
overwritten — a mistake is fixed with the next patch.

### D. Projects pick it up

Consumers get a Dependabot PR (or run `pnpm update`); see
[`docs/consuming.md`](docs/consuming.md). Template projects upgrade the same way; their build
lists any new tokens to add to their Figma copy.

The first consumer is this repo's own showcase (`apps/showcase`, its own pnpm root): after
each release, bump it to the new version and commit its lockfile (the token must be exported):

```bash
pnpm -C apps/showcase update '@max-core-ds/*@<version>'
pnpm showcase                        # check it renders, then commit apps/showcase/{package.json,pnpm-lock.yaml}
```

### Manual fallback (without Publish)

Plugin → **Download** → `pnpm -F @max-core-ds/tokens sync --input <file>` → `pnpm changeset` →
commit or PR. Everything from A.3 on is the same.

### Conventions and tokens

- Only the maintainer merges, and only when `ci` is green. `main` has a ruleset (PR + `ci`
  required; the maintainer can bypass to push directly).
- **Packages token** — classic, `write:packages`, the maintainer's, only for `pnpm release`.
- **Plugin token** — fine-grained, only this repo, Contents + Pull requests read/write, the
  designer's, saved in the plugin.
- **Read token** — classic, `read:packages`, per consumer developer / CI, only for installing.

---

## Architecture decisions (brief)

- **Headless library: Base UI** (`@base-ui/react`, formerly
  `@base-ui-components/react`). Multi-select, Number Field, Drawer, OTP
  Field, and Toast all ship native — Radix doesn't have these. Same
  accessibility quality.
- **Tokens are CSS variables**, not JS objects. Components read `var(--...)`
  so a single `tokens.css` change updates the visual output without
  rebuilding the component bundle.
- **Tailwind v4** with arbitrary-value classes (`bg-[var(--accent-default)]`).
  Allows direct binding to tokens without a JS config file.
- **CVA** for variant matrices. Cleanest known pattern for "3 variants × 4
  tones × 4 sizes" without combinatorial component duplication.
- **No icon library in `@max-core-ds/react`.** Icons are passed as `ReactNode`;
  consumers pick `lucide-react` (matches Figma), `@heroicons/react`, or
  anything else. We don't lock the choice.
- **Monorepo via pnpm + Turborepo.** Tokens, React, Figma plugin, Storybook
  all share workspace types and build in topological order.
- **Published to GitHub Packages, lockstep.** `@max-core-ds/tokens` and `@max-core-ds/react`
  always share one version (Changesets `fixed`), so a version names one Figma state.
- **Two test layers.** Behaviour tests (Vitest + React Testing Library, jsdom) for every
  component with logic; every Storybook story rendered in Chromium and scanned with axe. Known
  accessibility exceptions are declared, never silent ([`docs/a11y-exceptions.md`](docs/a11y-exceptions.md)).

---

## Status

- ✅ Token pipeline: Figma plugin → `tokens.json` → `tokens.css` + Tailwind `theme.css`, every
  Figma collection, text style and effect style
- ✅ **55 components** on their own Figma component tokens, drift-green, audited against Figma
- ✅ Storybook with dark-mode toggle and per-component stories
- ✅ CI on every PR and push (build, typecheck, lint, drift, a11y exception guard, tests;
  contrast reported)
- ✅ **Tests:** 177 behaviour tests + 173 story tests (render + axe), blocking in CI
- ✅ **Published:** `@max-core-ds/tokens` + `@max-core-ds/react` **0.1.0** on GitHub Packages
- ✅ Plugin **Publish to GitHub** (token PRs straight from Figma)

Open:

- ⚠️ Contrast: 9/34 components have WCAG AA findings, Figma-side (dark status/accent ramps)
- ⏳ Releases are run locally; a `release.yml` workflow can take over later

See `PLAN.md` for the phases and `PROGRESS.md` for the live status.

---

## Development

### Common commands (run from repo root)

```bash
pnpm install                    # Install all workspace deps
pnpm build                      # Build everything (turbo + cache)
pnpm typecheck                  # Run tsc across all packages
pnpm lint                       # Biome check
pnpm test                       # Behaviour tests + story tests (build first: stories use the built react)
pnpm format                     # Biome format (--write)
pnpm storybook                  # Storybook dev server
pnpm showcase                   # showcase dev server (own install first: apps/showcase/README.md)
pnpm changeset                  # describe a change for the next release
pnpm release                    # publish a release (see Release workflow)
```

### Per-package commands

```bash
# Tokens
pnpm -F @max-core-ds/tokens build         # tokens.json → tokens.css + theme.css + contract
pnpm -F @max-core-ds/tokens drift         # react ↔ Figma token conformance
pnpm -F @max-core-ds/tokens contrast      # WCAG AA report
pnpm -F @max-core-ds/tokens sync --input <file> [--dry-run]   # manual import

# React library
pnpm -F @max-core-ds/react build          # ESM + CJS + .d.ts
pnpm -F @max-core-ds/react dev            # tsup watch mode
pnpm -F @max-core-ds/react test           # behaviour tests (jsdom)
pnpm -F @max-core-ds/react test:watch     # … in watch mode

# Figma plugin
pnpm -F @max-core-ds/figma-plugin build   # esbuild → dist/
pnpm -F @max-core-ds/figma-plugin dev     # esbuild watch mode

# Storybook
pnpm -F @max-core-ds/storybook dev                  # http://localhost:6006
pnpm -F @max-core-ds/storybook build                # storybook-static/
pnpm -F @max-core-ds/storybook test                 # every story: render + axe (Chromium)
pnpm -F @max-core-ds/storybook a11y:exceptions      # exceptions ↔ docs/a11y-exceptions.md
```

### Toolchain versions

- Node 20+ (tested on 22.14)
- pnpm 11+
- TypeScript 5.7+, strict mode
- Biome 1.9
- Turborepo 2.9
- React 18.3 (peer 18 or 19)
- Base UI 1.5+
- Storybook 10.6+
- Vitest 5.1 (jsdom 29; Playwright Chromium for the story tests — `pnpm -F @max-core-ds/storybook exec playwright install chromium` once)
- Tailwind v4

### Adding a new component

1. Scaffold under `packages/react/src/components/YourComponent/`:
   - `YourComponent.tsx` — CVA + Tailwind classes reading `var(--token)`
   - `index.ts` — re-exports
2. Add to `packages/react/src/index.ts` barrel.
3. Add a story under `apps/storybook/src/stories/YourComponent.stories.tsx` — it is
   rendered and axe-scanned by `pnpm -F @max-core-ds/storybook test` automatically.
4. If it has logic (state, events, keyboard), add `YourComponent.test.tsx` next to it
   (see [Testing](#testing)).
5. Run `pnpm typecheck && pnpm test && pnpm storybook` to verify.

Story discipline: keep named stories minimal. Use Controls for prop
variations. Reserve separate stories for ReactNode compositions (icons,
slots), matrix views (`AllVariants`), and states that need setup data
(error states with prepopulated values).

### Testing

Two layers, both blocking in CI (`ci` job → **Tests**):

| Layer | Where | What |
|---|---|---|
| Behaviour | `packages/react/src/**/*.test.tsx` (Vitest + React Testing Library + user-event, jsdom) | state, events, keyboard, names / descriptions / `aria-invalid`, controlled vs uncontrolled, form submission |
| Stories | `apps/storybook` (Storybook `addon-vitest` + `addon-a11y`, Chromium) | every story renders without errors and passes an axe scan |

- Query by role and accessible name (`getByRole('button', { name: 'Save' })`), as a user or
  screen reader finds things. Shared contracts live in `packages/react/src/test/`
  (e.g. `text-field-contract.tsx` for the text fields).
- Contrast is not part of axe here (`color-contrast` off, A11Y-000): colours are Figma-owned
  and reported by `pnpm -F @max-core-ds/tokens contrast`.
- An accessibility check that must stay off is an **exception**: declare it in
  [`docs/a11y-exceptions.md`](docs/a11y-exceptions.md) and tag the code; the guard fails
  otherwise. `.only` is never allowed.
- Story tests use the **built** `@max-core-ds/react` (like Storybook): `pnpm build` first.

---

## Documentation

- **`docs/consuming.md`** — install and use the packages in a project
- **`apps/showcase/README.md`** — the in-repo consumer of the published packages + its CI job
- **`docs/template-usage.md`** — run your own brand on the Max Core components
- **`.changeset/README.md`** — how to write a changeset
- **`docs/a11y-exceptions.md`** — accessibility checks accepted in tests (declared + guarded)
- **`PLAN.md`** — implementation plans per phase
- **`PROGRESS.md`** — live component + Figma audit status (handoff doc)
- **`prompts/`** — reusable copy-paste guides: `component-audit.md` (audit a
  component against its Figma page) and `implement-component.md` (build a new component + story)
- **`CLAUDE.md`** — agent guardrails and project rules; references the docs
  below via `@`-imports
- **`docs/MAX-CORE-SUMMARY.md`** — system specification (token architecture,
  color system, typography, component inventory)
- **`docs/CLAUDE-ARCHIVE.md`** — historical component QA notes from the
  Figma side of the project
- **`docs/max-core-business-plan.md`** — product strategy

---

## License

(To be added.)
