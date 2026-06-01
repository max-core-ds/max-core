# Max Core React UI Library — Foundation Plan

## Context

Max Core is a design system **template**, not a fixed instance. The 4-level token cascade (Primitives → Semantics → Components → Variants) means an organization can fork it, change Level 1 primitives, and produce its own branded design system without touching component code. The stated goal in `MAX-CORE-SUMMARY.md` is: *"Designer changes in Figma → JSON export → UI updates automatically."*

This plan covers the **foundation phase**: setting up the project, the token pipeline, tooling, and the first 3–5 atoms to prove the architecture before scaling. It does **not** cover the full ~50-component buildout — that's planned separately once the foundation is validated.

The library targets React first. The two downstream consumers are (1) `npm install @max-core/react` for normal users and (2) later, a shadcn-style copy-in CLI for teams that want to fork.

---

## Architecture recommendation

### Layered stack

```
┌─ Figma file (designer source of truth) ──────────────────────┐
│  ouyi08XxN4l4VCsao1nNQu                                      │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌─ Figma Plugin (Layer 2) ─▼───────────────────────────────────┐
│  Reads variables → emits tokens.json                         │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌─ @max-core/tokens (CLI + transform) ─────────────────────────┐
│  tokens.json → tokens.css (CSS custom properties)            │
│                tailwind.preset.ts (Tailwind v4 @theme)       │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌─ @max-core/react (component library) ────────────────────────┐
│  Base UI primitives + Tailwind v4 classes reading CSS vars   │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌─ Consumer app ───────────────────────────────────────────────┐
│  Imports components, drops in tokens.css, themes via vars    │
└──────────────────────────────────────────────────────────────┘
```

### Key decisions

- **Headless foundation: Base UI** (`@base-ui-components/react`). Reached stable 1.0 in Dec 2025, actively maintained by MUI. Ships Combobox (→ Multiselect), Number Field (→ Stepper), Drawer (→ Bottom Sheet), OTP Field, and Toast natively — Radix doesn't. Same accessibility quality as Radix, slightly different API.
- **Tokens as runtime CSS variables**, not codegen'd into component source. Component code is hand-written and stable; only `tokens.css` regenerates from Figma exports. This preserves the template nature without the fragility of full codegen.
- **Tailwind v4** with `@theme` block reading the CSS variables. Utility classes themed via vars; no Tailwind config rewrites needed when tokens change.
- **CVA** (`class-variance-authority`) for variant-driven components (Button has size×variant×tone — CVA handles the matrix cleanly).
- **Monorepo with pnpm workspaces** — separates `packages/tokens`, `packages/react`, `packages/figma-plugin`, `apps/storybook`. Lets each evolve independently.
- **npm distribution first**, shadcn-style registry deferred to a later phase (separate CLI that re-exports from the npm package source).
- **Inter font** loaded via `@fontsource/inter` — matches Max Core's spec.

### Why this shape works for a template DS

Two consumers of "Max Core" can ship identical component code but visually different products. Each ships its own `tokens.css`. The component library has zero opinion on color, radius, or spacing — those come from CSS variables defined per-consumer. Dark mode is a `[data-theme="dark"]` selector that swaps the same variables.

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Headless primitives | `@base-ui-components/react` v1.x | Multiselect/Stepper/Drawer/Toast included; actively maintained |
| Styling | Tailwind CSS v4 | `@theme` block + CSS-first, designed for token-driven systems |
| Variant API | `class-variance-authority` (CVA) | Standard for Tailwind component variants |
| Class merging | `tailwind-merge` | Resolves Tailwind class conflicts from consumer overrides |
| Component dev | Storybook 8.x | Stories mirror Figma showcase pages |
| Build | `tsup` (lib) + Vite (Storybook + plugin) | Fast, no config |
| Types | TypeScript 5.x strict | |
| Test | Vitest + `@testing-library/react` + axe | a11y baked in from day one |
| Visual regression | Chromatic (deferred) | Plug into Storybook later |
| Package manager | pnpm workspaces | |
| Monorepo tooling | Turborepo (lightweight) | Caches builds across packages |
| Font | `@fontsource-variable/inter` | Matches Max Core spec |
| Lint/format | Biome | Single tool replacing ESLint + Prettier |

---

## Tools to install

### For Razvan (user)

| Tool | Why | How |
|---|---|---|
| **Figma Desktop app** | Required to run the Dev Mode MCP locally | https://www.figma.com/downloads/ |
| **Figma Dev/Full seat** | Dev Mode MCP requires a paid seat | Figma billing |
| **Node.js 20 LTS** | Runtime | `nvm install 20 && nvm use 20` |
| **pnpm 9.x** | Workspace package manager | `npm i -g pnpm` |
| **VS Code + Biome extension** | Editor + lint | optional |

### For Claude (MCP servers)

| MCP | Why | Setup |
|---|---|---|
| **Figma Dev Mode MCP** (official) | Read frames, variables, screenshots from selected Figma nodes | Enable in Figma Desktop → Preferences → "Enable Dev Mode MCP server", then add to `~/.claude/settings.json` MCP config block. Server runs at `http://127.0.0.1:3845/sse` |
| **Filesystem** | Already covered by Claude Code's built-in tools | — |
| **Chrome DevTools MCP** (optional, later) | Browser-driven verification of Storybook | Add when verification work starts |

The Dev Mode MCP gives me direct access to the Figma file already referenced in `CLAUDE.md` (`ouyi08XxN4l4VCsao1nNQu`). I'll be able to fetch variable definitions, component metadata, and screenshots without you exporting anything manually.

---

## Repository layout

```
max-core/
├── package.json                    # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
├── tsconfig.base.json
├── packages/
│   ├── tokens/                     # @max-core/tokens
│   │   ├── src/
│   │   │   ├── tokens.json         # Hand-authored seed; later overwritten by plugin
│   │   │   ├── transform.ts        # JSON → CSS vars + Tailwind preset
│   │   │   └── cli.ts              # `max-core-tokens build`
│   │   └── dist/
│   │       ├── tokens.css
│   │       ├── tokens.dark.css
│   │       └── tailwind.preset.ts
│   ├── react/                      # @max-core/react
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Avatar/
│   │   │   │   ├── Badge/
│   │   │   │   ├── Tag/
│   │   │   │   └── Input/
│   │   │   ├── utils/cn.ts         # clsx + tailwind-merge
│   │   │   └── index.ts
│   │   └── tsup.config.ts
│   └── figma-plugin/               # Layer 2 plugin (deferred to phase 2)
│       └── README.md               # contract for tokens.json shape
└── apps/
    └── storybook/
        ├── .storybook/
        └── src/stories/
```

---

## Phase 1 deliverables (foundation — this plan)

### 1. Repo bootstrap
- pnpm workspace + Turborepo at root
- TypeScript base config (strict, `moduleResolution: bundler`)
- Biome for lint/format
- `.gitignore` covering Node/Vite/Storybook artifacts

### 2. `@max-core/tokens` package
- Hand-author `tokens.json` from `MAX-CORE-SUMMARY.md` (primitives + semantics + colors for both modes). Treat this as the seed file the Figma plugin will later overwrite.
- Write `transform.ts` that produces:
  - `tokens.css` — `:root { --bg-surface: ...; }` + `[data-theme="dark"] { ... }`
  - `tailwind.preset.ts` — Tailwind v4 `@theme` block mapping utility names to `var(--token)`
- CLI entrypoint `max-core-tokens build` for regeneration
- Define the **tokens.json contract** as the input/output schema (this is what the Figma plugin will emit later)

### 3. `@max-core/react` package — first 5 atoms

Selected to stress every layer of the stack:

| Atom | Why included | Headless source |
|---|---|---|
| **Button** | Most variant-heavy (3 variants × 4 tones × 4 sizes + states). Validates CVA + Tailwind variant matrix. | Base UI `Button` |
| **Avatar** | Pure visual, no behavior. Validates token-only styling and image fallback. | Base UI `Avatar` |
| **Badge** | Pure visual atom. Validates the "no headless needed" path. | None — custom |
| **Tag** | Has a Selected boolean (Toggle-like). Validates state styling. | Base UI `Toggle` |
| **Input (Base Input)** | First form component. Validates focus ring (the architecture per `CLAUDE.md`), Label/Helper/Error slots, disabled state. | Base UI `Field` + `Input` |

For each atom:
- Component file using Base UI primitive (where applicable) + CVA + Tailwind classes that read `var(--token)`
- `*.stories.tsx` mirroring the Figma showcase layout (variants × sizes × states grid)
- Inline TSDoc on the props
- Vitest test covering: renders, variant classes apply, a11y (axe), keyboard interaction

### 4. Storybook app
- Storybook 8 with Vite builder
- Dark mode toggle that flips `[data-theme="dark"]` on the preview root
- Token reference page (renders all `--bg-*`, `--text-*`, `--accent-*` swatches with their resolved values) — useful for visual QA against Figma
- Component stories per atom

### 5. Conventions documented in code
- `CONTRIBUTING.md` covers: adding a new component, the naming → CSS variable mapping (from `CLAUDE.md`), the `--`/`-`/`---` token prefix meanings.
- One-page `ARCHITECTURE.md` summarizing the diagram above.

---

## Critical files to create

- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `biome.json`, `tsconfig.base.json` at root
- `packages/tokens/src/tokens.json` — seed token file
- `packages/tokens/src/transform.ts` — JSON → CSS + Tailwind preset
- `packages/react/src/components/Button/Button.tsx` and `Button.stories.tsx`
- `packages/react/src/components/{Avatar,Badge,Tag,Input}/` parallel structure
- `packages/react/src/utils/cn.ts` — `clsx` + `tailwind-merge` helper
- `apps/storybook/.storybook/preview.tsx` — imports `tokens.css`, sets up dark mode toggle

Reused conventions from existing docs:
- Token naming and color semantics come straight from `CLAUDE.md` (the `--`/`-` prefix system and the `bg/*`, `text/*`, `accent/*`, `status/*` groups). The CSS variable names follow that scheme verbatim (e.g. `--bg-surface`, `--accent-default`, `--status-danger-default`).
- Focus ring architecture from `CLAUDE.md` ("ring in INPUT FRAME, not in wrapper") — implemented in `Input` as an absolutely-positioned outline element on the input itself, conditional on `:focus-visible`.

---

## Out of scope for this phase

- Figma plugin source (Layer 2). Plan defines the JSON contract only; plugin built next phase.
- Remaining ~45 components (~15 atoms, ~15 molecules, ~10 organisms + Data Table system).
- Date Picker — needs a separate decision (build on `react-day-picker` vs. Base UI Calendar+Popover composition).
- shadcn-style copy-in CLI — deferred until npm package is stable.
- Visual regression (Chromatic) — wire in once 10+ components exist.
- Docs site — Storybook is enough for now.

---

## Verification

After phase 1 build is complete:

1. **Token pipeline**: `pnpm -F @max-core/tokens build` produces `dist/tokens.css`. Open the file and confirm `--bg-surface`, `--text-primary`, `--accent-default` exist with values matching `MAX-CORE-SUMMARY.md`.
2. **Token swap test**: Edit a Level 1 primitive in `tokens.json` (e.g. change indigo `#6366F1` → `#FF0000`), rebuild, refresh Storybook. Every accent-tinted element should turn red. This proves the template architecture works.
3. **Storybook visual check**: `pnpm -F storybook dev` opens. All 5 atoms render in light and dark modes. Dark mode toggle in the preview flips correctly.
4. **Comparison against Figma**: For each atom, side-by-side screenshot of Storybook vs. the Figma showcase page. No hardcoded values should differ from the token-driven CSS output.
5. **Tests**: `pnpm test` passes. axe finds zero a11y violations on each atom.
6. **Build**: `pnpm -F @max-core/react build` produces `dist/` with ESM + CJS + `.d.ts`. Import path `@max-core/react` resolves in a scratch app.
7. **MCP smoke test**: With Figma Dev Mode MCP enabled and a frame selected in Figma Desktop, I can run a tool call that reads the variable definitions for that frame and confirm they match `tokens.json`.

---

## Sources consulted

- [Base UI 1.0 stable release coverage (InfoQ, Feb 2026)](https://www.infoq.com/news/2026/02/baseui-v1-accessible/)
- [Base UI vs Radix UI: A Detailed Comparison in 2026 (BestskyTools)](https://bestsky.tools/blog/base-ui-vs-radix-ui)
- [Headless UI alternatives (LogRocket)](https://blog.logrocket.com/headless-ui-alternatives/)
- [Base UI quick start / component list](https://base-ui.com/react/overview/quick-start)
- [Base UI Combobox + Autocomplete](https://base-ui.com/react/components/combobox)
- Local docs: `MAX-CORE-SUMMARY.md`, `CLAUDE.md`

---

# Phase 2 — Token sync (plugin + CLI)

## Context

Phase 1 shipped tokens + 5 atoms, with tokens verified against Figma via manual `use_figma` MCP calls. That doesn't scale: Max Core is a **template**, and every downstream consumer (Acme, Stripe, etc.) needs its own way to keep their codebase tokens in sync with their cloned Figma file. Without an automated sync mechanism, the template can't be delivered as a product.

The cleanest path is a CLI that talks to Figma's REST API, but **the Variables REST API is Enterprise-only** (verified at [Figma Variables docs](https://developers.figma.com/docs/rest-api/variables/)). The user is on Starter plan with a Full seat — that path is blocked for development testing.

**Hybrid approach (chosen):** a Figma plugin exports `tokens.json` to the designer's Downloads folder (Plugin API works on any tier, fully testable now), and a CLI extension to `@max-core/tokens` ingests that JSON file into the repo. End-state matches a pure CLI workflow. Enterprise consumers can later swap the plugin step for a direct REST API call — the JSON contract and downstream pipeline stay identical.

## Recommended approach

### Pipeline

```
[Designer in Figma Desktop]
  ↓ opens Max Core Token Export plugin → clicks Export
[Figma Plugin — new packages/figma-plugin]
  ↓ reads Primitives, Semantics, Colors via Plugin API
  ↓ builds tokens.json matching @max-core/tokens contract
  ↓ triggers browser download
[Designer's ~/Downloads/tokens.json]
  ↓ developer runs: pnpm -F @max-core/tokens sync
[CLI sync.ts — new]
  ↓ validates schema, diffs vs current, writes to packages/tokens/src/tokens.json
[Existing build pipeline]
  ↓ pnpm build → tokens.css regenerated → Storybook updates
```

### New package: `packages/figma-plugin/`

```
packages/figma-plugin/
├── manifest.json        # Figma plugin manifest (apiVersion 1.0.0, editorType: ["figma"])
├── package.json
├── tsconfig.json
├── esbuild.config.ts    # bundles src/code.ts → dist/code.js
├── src/
│   ├── code.ts          # sandbox: reads variables, posts to UI
│   ├── ui.html          # plugin panel: button + counts, triggers download
│   └── transform.ts     # Plugin API variable data → TokensFile shape
└── dist/                # built artifacts loaded by Figma
```

Plugin behavior:
- Manifest declares `editorType: ["figma"]`, points `main` at `dist/code.js`, `ui` at `dist/ui.html`
- `code.ts` runs in sandbox: calls `figma.variables.getLocalVariableCollectionsAsync()`, walks Primitives + Semantics + Colors (skips Components — same deferral as Phase 1)
- Resolves alias chains via `figma.variables.getVariableByIdAsync()`
- Normalizes into `TokensFile` shape using shared transform module
- `figma.ui.postMessage({type: 'tokens', payload})` to UI
- `ui.html` receives message, creates `Blob` → `URL.createObjectURL` → anchor click → download as `tokens.json`
- UI shows verification counts before download (e.g. "Exporting 113 primitives · 117 colors · 50 semantics")

### CLI extension: `packages/tokens/src/sync.ts`

New script alongside existing `cli.ts`. Behavior:
- Default input: `~/Downloads/tokens.json` (override via `--input <path>`)
- Validates the JSON against `TokensFile` interface
- Diffs vs current `packages/tokens/src/tokens.json` — reports added / removed / changed token counts
- Writes to `packages/tokens/src/tokens.json` (overwrites)
- `--dry-run` flag previews without writing
- No new runtime deps required — uses Node's `fs` and existing types

Updates to `packages/tokens/package.json`:
- Add script: `"sync": "tsx src/sync.ts"`
- No new dependencies

### Shared TokensFile contract

The plugin and CLI both target the existing `TokensFile` interface (currently at `packages/tokens/src/transform.ts:11-26`). Phase 2 doesn't change the contract — it provides mechanical ways to populate it.

**One refactor during this phase:** extract the `TokensFile` type into `packages/tokens/src/types.ts` so the plugin can import it without dragging the CSS transform code (and its Node-specific imports) into the Figma sandbox. Both `transform.ts` and `cli.ts` then import from `types.ts`.

## Critical files

**New:**
- `packages/figma-plugin/{manifest.json, package.json, tsconfig.json, esbuild.config.ts}` — package scaffolding
- `packages/figma-plugin/src/code.ts` — plugin sandbox entry, reads variables
- `packages/figma-plugin/src/ui.html` — plugin UI panel
- `packages/figma-plugin/src/transform.ts` — Plugin API → `TokensFile` (mirror of the `use_figma` script we already validated in this conversation)
- `packages/tokens/src/sync.ts` — CLI ingestion
- `packages/tokens/src/types.ts` — extracted `TokensFile` interface

**Modified:**
- `packages/tokens/src/transform.ts` — import `TokensFile` from `types.ts`
- `packages/tokens/src/cli.ts` — import `TokensFile` from `types.ts`
- `packages/tokens/package.json` — add `sync` script
- `pnpm-workspace.yaml` — already globs `packages/*`, no change

**Reused (no changes needed):**
- Existing `use_figma` script we wrote during Phase 1 verification — the plugin's `transform.ts` is essentially the same logic, lifted from JavaScript in the MCP call to TypeScript in a real package
- Existing `TokensFile` shape — already validated end-to-end through the cascade

## Dependencies to add

For the plugin package:
- `@figma/plugin-typings` — TypeScript types for the Plugin API (devDep)
- `esbuild` — bundler for the sandbox code (devDep; could substitute Vite, but esbuild is lighter for single-file output)

For `@max-core/tokens` — none.

## Verification

1. **Plugin loads in Figma Desktop**: build via `pnpm -F figma-plugin build`. In Figma Desktop: Plugins → Development → Import plugin from manifest → select `packages/figma-plugin/dist/manifest.json`.
2. **Plugin runs**: open Max Core file, run plugin, click Export. UI shows correct collection counts (matches what we saw via `use_figma`: 113 primitives, 117 colors, 50ish semantics).
3. **Download fires**: `tokens.json` appears in `~/Downloads/` with current timestamp.
4. **JSON contract holds**: diff downloaded JSON vs current `packages/tokens/src/tokens.json`. Structure identical; values match what we already verified against Figma.
5. **CLI ingests**: `pnpm -F @max-core/tokens sync` reads from Downloads, reports diff stats, writes to repo. Exit code 0.
6. **Existing build still works**: `pnpm -F @max-core/tokens build` regenerates `tokens.css`. Variable count unchanged.
7. **Storybook unaffected**: refresh Storybook (already running) — no visual changes (since we just round-tripped the same data).
8. **Round-trip test (the real proof)**: in Figma, change `spacing/scale/16` from 16 → 18. Re-run plugin → re-run sync → re-run build → refresh Storybook. Any component using `--spacing-16` (most atoms) shows the new spacing. Reset Figma value when done.
9. **Dry-run safety**: `pnpm -F @max-core/tokens sync --dry-run` prints diff but does not modify `tokens.json`.

## Out of scope for Phase 2

- **Components collection** — same deferral as Phase 1; not used by current 5 atoms. Once we wire it up, the plugin gains one more collection to walk and the JSON contract grows a `components` layer.
- **Public Figma plugin distribution** — Phase 2 is private development plugin only. Listing on the Figma Community is a separate work item (requires plugin description, screenshots, review process).
- **Direct REST API sync for Enterprise consumers** — separate future work. Will reuse the same `transform.ts` module to map REST API response → `TokensFile`. Same downstream pipeline.
- **WCAG contrast audit** — Layer 2's audit component (per `MAX-CORE-SUMMARY.md`) is a future enhancement on top of the plugin: enumerate text/bg color pairs, compute contrast ratios, flag failures. Doesn't need to land with the export feature.
- **Watch mode / auto-sync** — designer manually triggers exports; not a constant background process.
- **Test mode handling** — plugin reads `Max core` mode only. The `Test` mode in Figma (the cascade swap mechanism) is for designer verification, not code output.

## Sources

- [Figma Plugin API — Variables documentation](https://www.figma.com/plugin-docs/api/figma-variables/)
- [Figma REST API — Variables (Enterprise-only confirmation)](https://developers.figma.com/docs/rest-api/variables/)
- [Figma plugin manifest reference](https://www.figma.com/plugin-docs/manifest/)
- Existing project artifacts: `packages/tokens/src/{tokens.json,transform.ts,cli.ts}`, the `use_figma` script we ran in this conversation
