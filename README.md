# Max Core

A parameterized React design system **template** driven by Figma variables.

Max Core is not a single design system — it's a starting point that consuming
organizations clone, fork, and customize. The same component code can power
any number of branded design systems; what differs is the `tokens.json` each
consumer maintains in sync with their own Figma file.

The headline claim: **designer changes a variable in Figma → plugin exports JSON
→ CLI syncs it into the repo → CSS regenerates → every component reflects
the change.** No code edits required for token updates.

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

---

## Project structure

```
max-core/
├── CLAUDE.md                         # Agent guardrails and project rules
├── PLAN.md                           # Phase-by-phase implementation plan
├── PROGRESS.md                       # Live component + cross-check status
├── docs/
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
│   └── storybook/                    # Storybook 10 component workshop
├── package.json                      # Workspace root scripts
├── pnpm-workspace.yaml               # Workspace package paths
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

- `src/tokens.json` — the canonical token data, mirroring the cascade in the
  Figma file (Primitives → Semantics → Colors with light/dark modes).
- `src/transform.ts` — pure function: token tree → CSS string with `:root` +
  `[data-theme="dark"]` blocks.
- `src/cli.ts` — entrypoint that reads the JSON, runs the transform, writes
  `dist/tokens.css`.
- `src/sync.ts` — CLI that ingests a fresh `tokens.json` produced by the Figma
  plugin (default location: `~/Downloads/tokens.json`).
- `src/types.ts` — the `TokensFile` interface, shared with the Figma plugin
  package.

**How to use it.**

```bash
# Build CSS variables from the current tokens.json
pnpm -F @max-core-ds/tokens build

# Sync from a fresh plugin export (preview first)
pnpm -F @max-core-ds/tokens sync --dry-run
pnpm -F @max-core-ds/tokens sync

# Sync from a custom location
pnpm -F @max-core-ds/tokens sync --input /path/to/tokens.json
```

**What it produces.**

```css
/* dist/tokens.css */
:root {
  --spacing-04: 4px;
  --accent-default: #4F46E5;
  --bg-surface: #FFFFFF;
  /* ...156 variables */
}
[data-theme="dark"] {
  --accent-default: #818CF8;
  --bg-surface: #1E293B;
  /* ...51 dark-mode overrides */
}
```

The `tokens.json` is **committed to git** — it's the source of build, not
a build artifact. Anyone can clone the repo and produce `tokens.css`
without needing Figma access.

---

### `@max-core-ds/react`

**What it is.** The React component library — 45 components across atoms,
molecules, and organisms. All are typed, built (tsup), and drift-green against
their Figma token spec.

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
Bottom Sheet premades) and that there are no tests yet.

Because it's a workspace package at `0.0.0` (not published to npm), "consume"
today means inside this monorepo, via `pnpm link`, or from a tarball — not a
public `npm install`.

**Build.**

```bash
pnpm -F @max-core-ds/react build
# → dist/index.js (ESM), dist/index.cjs (CJS), dist/index.d.ts (types)
```

---

### `@max-core-ds/figma-plugin`

**What it is.** A Figma Desktop plugin that reads the Max Core file's
variables and exports a `tokens.json` matching `@max-core-ds/tokens`'s contract.

**Why it exists.** The Figma REST API for variables requires an Enterprise
plan. The Plugin API works on any tier. This is the "any tier" bridge.

**What's inside.**

- `manifest.json` — Figma plugin manifest. Declares `editorType: ["figma",
  "dev"]` and `capabilities: ["inspect"]` so it runs in design mode AND
  Dev Mode's right-side panel.
- `src/code.ts` — the sandbox entrypoint. Opens the UI, handles messages.
- `src/ui.html` — Figma-themed panel with an Export button. Receives the
  JSON, creates a `Blob`, triggers a download.
- `src/transform.ts` — Figma Plugin API → `TokensFile`. Walks Primitives,
  Semantics, and Colors collections, resolves alias chains, normalizes
  naming and units.
- `esbuild.config.mjs` — bundles `src/code.ts` to a single IIFE for the
  sandbox.

**How to install in Figma Desktop.**

1. Build the plugin:
   ```bash
   pnpm -F @max-core-ds/figma-plugin build
   ```
2. Open the Max Core file in Figma Desktop.
3. **Plugins → Development → Import plugin from manifest…**
4. Select `packages/figma-plugin/manifest.json`.
5. Run the plugin from **Plugins → Development → Max Core Token Export**
   (or from the Dev Mode panel if you're in `Shift + D`).

The plugin runs only when you have **edit access** to the file (Figma
restriction on development plugins, even read-only ones).

**Output.** Downloads `tokens.json` to your browser's Downloads folder.
Then `pnpm -F @max-core-ds/tokens sync` pulls it into the repo.

**Skipped intentionally.** The Components-level collection (Layer 3 of the
cascade) is not exported. Current atoms read semantic tokens directly;
component-level tokens become useful when consumers want to re-wire which
semantic each component slot uses without code changes. Deferred to a
later phase.

---

### `apps/storybook`

**What it is.** A Storybook 10 app for browsing and stress-testing components.

**What's inside.**

- `.storybook/main.ts` — framework config (React + Vite), addon list.
- `.storybook/preview.tsx` — global decorators including the dark-mode
  toggle. Imports `src/global.css`.
- `src/global.css` — Tailwind v4 entry + `@source` directives pointing at
  `packages/react/src/**` so utility classes used there are emitted.
- `src/stories/` — one stories file per atom + a Foundations / Tokens story
  with color, spacing, and radius reference swatches.
- `vite.config.ts` — wires the Tailwind v4 Vite plugin.

**How to use it.**

```bash
# Dev server with hot reload
pnpm storybook
# → http://localhost:6006

# Static build (for deployment)
pnpm -F storybook build
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

## How the token pipeline works (end-to-end)

```
┌─ Figma file ──────────────────────────────────────────────────┐
│  Designer edits a variable (e.g. spacing/scale/16: 16 → 20).  │
└─────────────────────────────┬─────────────────────────────────┘
                              ↓
┌─ Plugin ──────────────────────────────────────────────────────┐
│  Designer (or dev) runs the Max Core Token Export plugin.     │
│  Plugin reads all collections via Figma Plugin API, builds    │
│  a TokensFile JSON, triggers browser download.                │
└─────────────────────────────┬─────────────────────────────────┘
                              ↓
              ~/Downloads/tokens.json
                              ↓
┌─ Sync CLI ────────────────────────────────────────────────────┐
│  Developer runs: pnpm -F @max-core-ds/tokens sync                │
│  Validates shape, diffs vs current, writes to                 │
│  packages/tokens/src/tokens.json.                             │
└─────────────────────────────┬─────────────────────────────────┘
                              ↓
       Developer commits the updated tokens.json
                              ↓
┌─ Build CLI ───────────────────────────────────────────────────┐
│  pnpm -F @max-core-ds/tokens build                               │
│  → packages/tokens/dist/tokens.css                            │
└─────────────────────────────┬─────────────────────────────────┘
                              ↓
┌─ Consumers ───────────────────────────────────────────────────┐
│  Storybook hot-reloads, atoms reflect the new value.          │
│  Downstream consumer apps that import @max-core-ds/tokens get    │
│  the same CSS when they rebuild.                              │
└───────────────────────────────────────────────────────────────┘
```

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
- **No tests yet.** Honest gap. See "Status" below.

---

## Status

Phases 1–3 of `PLAN.md` are complete:

- ✅ Repo skeleton, workspace tooling, configs
- ✅ Token pipeline (transform CLI + sync CLI + `tokens.json` from Figma)
- ✅ **45 components** (atoms, molecules, organisms) with CVA variants — all
  typed, built, and drift-green
- ✅ Storybook with dark-mode toggle, per-component stories, token reference
- ✅ Figma plugin building and verified end-to-end
- ✅ **Phase 4.5 — component audit against Figma** complete (40 pages). See
  [`PROGRESS.md`](PROGRESS.md).

Gaps to "production-ready":

- ❌ No tests (Vitest + axe deferred)
- ❌ Components-level tokens (Layer 3 cascade) not yet bridged
- ❌ Not published to npm
- ❌ No CI/CD
- ❌ Figma plugin not on the public Community marketplace

See `PLAN.md` for what each phase contained and what's next, and `PROGRESS.md`
for the live component + cross-check status.

---

## Development

### Common commands (run from repo root)

```bash
pnpm install                    # Install all workspace deps
pnpm build                      # Build everything (turbo + cache)
pnpm typecheck                  # Run tsc across all packages
pnpm lint                       # Biome check
pnpm format                     # Biome format (--write)
pnpm storybook                  # Storybook dev server
```

### Per-package commands

```bash
# Tokens
pnpm -F @max-core-ds/tokens build         # tokens.json → tokens.css
pnpm -F @max-core-ds/tokens sync          # Figma export → tokens.json
pnpm -F @max-core-ds/tokens sync --dry-run

# React library
pnpm -F @max-core-ds/react build          # ESM + CJS + .d.ts
pnpm -F @max-core-ds/react dev            # tsup watch mode

# Figma plugin
pnpm -F @max-core-ds/figma-plugin build   # esbuild → dist/
pnpm -F @max-core-ds/figma-plugin dev     # esbuild watch mode

# Storybook
pnpm -F storybook dev                  # http://localhost:6006
pnpm -F storybook build                # storybook-static/
```

### Toolchain versions

- Node 20+ (tested on 22.14)
- pnpm 11+
- TypeScript 5.7+, strict mode
- Biome 1.9
- Turborepo 2.9
- React 18.3 (peer 18 or 19)
- Base UI 1.5+
- Storybook 10.4+
- Tailwind v4

### Adding a new component

1. Scaffold under `packages/react/src/components/YourComponent/`:
   - `YourComponent.tsx` — CVA + Tailwind classes reading `var(--token)`
   - `index.ts` — re-exports
2. Add to `packages/react/src/index.ts` barrel.
3. Add a story under `apps/storybook/src/stories/YourComponent.stories.tsx`.
4. Run `pnpm typecheck && pnpm storybook` to verify.

Story discipline: keep named stories minimal. Use Controls for prop
variations. Reserve separate stories for ReactNode compositions (icons,
slots), matrix views (`AllVariants`), and states that need setup data
(error states with prepopulated values).

---

## Documentation

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
