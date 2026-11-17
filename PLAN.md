# Max Core React UI Library — Foundation Plan

## Context

Max Core is a design system **template**, not a fixed instance. The 4-level token cascade (Primitives → Semantics → Components → Variants) means an organization can fork it, change Level 1 primitives, and produce its own branded design system without touching component code. The stated goal in `MAX-CORE-SUMMARY.md` is: *"Designer changes in Figma → JSON export → UI updates automatically."*

This plan covers the **foundation phase**: setting up the project, the token pipeline, tooling, and the first 3–5 atoms to prove the architecture before scaling. It does **not** cover the full ~50-component buildout — that's planned separately once the foundation is validated.

The library targets React first. The two downstream consumers are (1) `npm install @max-core-ds/react` for normal users and (2) later, a shadcn-style copy-in CLI for teams that want to fork.

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
┌─ @max-core-ds/tokens (CLI + transform) ─────────────────────────┐
│  tokens.json → tokens.css (CSS custom properties)            │
│                tailwind.preset.ts (Tailwind v4 @theme)       │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌─ @max-core-ds/react (component library) ────────────────────────┐
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
│   ├── tokens/                     # @max-core-ds/tokens
│   │   ├── src/
│   │   │   ├── tokens.json         # Hand-authored seed; later overwritten by plugin
│   │   │   ├── transform.ts        # JSON → CSS vars + Tailwind preset
│   │   │   └── cli.ts              # `max-core-tokens build`
│   │   └── dist/
│   │       ├── tokens.css
│   │       ├── tokens.dark.css
│   │       └── tailwind.preset.ts
│   ├── react/                      # @max-core-ds/react
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

## Phase 1 deliverables (foundation — this plan) — ✅ DONE

> **Status:** Shipped. Token pipeline + 5 atoms (Avatar, Badge, Button, Input, Tag) + Storybook (incl. Tokens reference story) all in place. Automated tests (Vitest + axe) were deferred to a later phase by decision — not delivered here.

### 1. Repo bootstrap
- pnpm workspace + Turborepo at root
- TypeScript base config (strict, `moduleResolution: bundler`)
- Biome for lint/format
- `.gitignore` covering Node/Vite/Storybook artifacts

### 2. `@max-core-ds/tokens` package
- Hand-author `tokens.json` from `MAX-CORE-SUMMARY.md` (primitives + semantics + colors for both modes). Treat this as the seed file the Figma plugin will later overwrite.
- Write `transform.ts` that produces:
  - `tokens.css` — `:root { --bg-surface: ...; }` + `[data-theme="dark"] { ... }`
  - `tailwind.preset.ts` — Tailwind v4 `@theme` block mapping utility names to `var(--token)`
- CLI entrypoint `max-core-tokens build` for regeneration
- Define the **tokens.json contract** as the input/output schema (this is what the Figma plugin will emit later)

### 3. `@max-core-ds/react` package — first 5 atoms

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
- Date Picker — ✅ decided & built (Phase 4 Batch 12): `react-day-picker@9` restyled onto tokens (chosen over baseui-cn copy-in and react-aria). See PROGRESS.md.
- shadcn-style copy-in CLI — deferred until npm package is stable.
- Visual regression (Chromatic) — wire in once 10+ components exist.
- Docs site — Storybook is enough for now.

---

## Verification

After phase 1 build is complete:

1. **Token pipeline**: `pnpm -F @max-core-ds/tokens build` produces `dist/tokens.css`. Open the file and confirm `--bg-surface`, `--text-primary`, `--accent-default` exist with values matching `MAX-CORE-SUMMARY.md`.
2. **Token swap test**: Edit a Level 1 primitive in `tokens.json` (e.g. change indigo `#6366F1` → `#FF0000`), rebuild, refresh Storybook. Every accent-tinted element should turn red. This proves the template architecture works.
3. **Storybook visual check**: `pnpm -F @max-core-ds/storybook dev` opens. All 5 atoms render in light and dark modes. Dark mode toggle in the preview flips correctly.
4. **Comparison against Figma**: For each atom, side-by-side screenshot of Storybook vs. the Figma showcase page. No hardcoded values should differ from the token-driven CSS output.
5. **Tests**: `pnpm test` passes. axe finds zero a11y violations on each atom.
6. **Build**: `pnpm -F @max-core-ds/react build` produces `dist/` with ESM + CJS + `.d.ts`. Import path `@max-core-ds/react` resolves in a scratch app.
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

# Phase 2 — Token sync (plugin + CLI) — ✅ DONE

> **Status:** Shipped. `packages/figma-plugin` (export) + `packages/tokens/src/sync.ts` (ingest) + extracted `types.ts` all in place. Scope note: the Components collection (414 tokens) and shadow Effect Styles (12) are now **exported** into `tokens.json` — going beyond the "skip Components" deferral written below — but they are **not yet consumed by CSS** (see Deferred decision D1).

## Context

Phase 1 shipped tokens + 5 atoms, with tokens verified against Figma via manual `use_figma` MCP calls. That doesn't scale: Max Core is a **template**, and every downstream consumer (Acme, Stripe, etc.) needs its own way to keep their codebase tokens in sync with their cloned Figma file. Without an automated sync mechanism, the template can't be delivered as a product.

The cleanest path is a CLI that talks to Figma's REST API, but **the Variables REST API is Enterprise-only** (verified at [Figma Variables docs](https://developers.figma.com/docs/rest-api/variables/)). The user is on Starter plan with a Full seat — that path is blocked for development testing.

**Hybrid approach (chosen):** a Figma plugin exports `tokens.json` to the designer's Downloads folder (Plugin API works on any tier, fully testable now), and a CLI extension to `@max-core-ds/tokens` ingests that JSON file into the repo. End-state matches a pure CLI workflow. Enterprise consumers can later swap the plugin step for a direct REST API call — the JSON contract and downstream pipeline stay identical.

## Recommended approach

### Pipeline

```
[Designer in Figma Desktop]
  ↓ opens Max Core Token Export plugin → clicks Export
[Figma Plugin — new packages/figma-plugin]
  ↓ reads Primitives, Semantics, Colors via Plugin API
  ↓ builds tokens.json matching @max-core-ds/tokens contract
  ↓ triggers browser download
[Designer's ~/Downloads/tokens.json]
  ↓ developer runs: pnpm -F @max-core-ds/tokens sync
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

For `@max-core-ds/tokens` — none.

## Verification

1. **Plugin loads in Figma Desktop**: build via `pnpm -F figma-plugin build`. In Figma Desktop: Plugins → Development → Import plugin from manifest → select `packages/figma-plugin/dist/manifest.json`.
2. **Plugin runs**: open Max Core file, run plugin, click Export. UI shows correct collection counts (matches what we saw via `use_figma`: 113 primitives, 117 colors, 50ish semantics).
3. **Download fires**: `tokens.json` appears in `~/Downloads/` with current timestamp.
4. **JSON contract holds**: diff downloaded JSON vs current `packages/tokens/src/tokens.json`. Structure identical; values match what we already verified against Figma.
5. **CLI ingests**: `pnpm -F @max-core-ds/tokens sync` reads from Downloads, reports diff stats, writes to repo. Exit code 0.
6. **Existing build still works**: `pnpm -F @max-core-ds/tokens build` regenerates `tokens.css`. Variable count unchanged.
7. **Storybook unaffected**: refresh Storybook (already running) — no visual changes (since we just round-tripped the same data).
8. **Round-trip test (the real proof)**: in Figma, change `spacing/scale/16` from 16 → 18. Re-run plugin → re-run sync → re-run build → refresh Storybook. Any component using `--spacing-16` (most atoms) shows the new spacing. Reset Figma value when done.
9. **Dry-run safety**: `pnpm -F @max-core-ds/tokens sync --dry-run` prints diff but does not modify `tokens.json`.

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

---

# Deferred decisions

Open decisions intentionally parked. Resolve before the work that depends on them.

## D1 — Token cascade: should component code read Component-level CSS vars, or stay on Semantic vars?

**Status: DECIDED — Option 2 (keep semantic vars).** (Resolved 2026-07-11, before Phase 3.) Components bind directly to semantic CSS vars; the transform does **not** gain an `emitComponents()`. The 414-token Components collection stays a **build-time spec** and now earns its keep as the source for the **drift-check conformance test** built in Phase 3 Batch 0 (see Phase 3). Rationale: fastest path, no refactor of existing atoms, rebrand-via-primitives still cascades; the only thing given up is per-single-component override in code, which no current requirement needs.

**Background.** The Figma **Components collection** (414 tokens, e.g. `-- Atoms/Buttons/Global/Size M/Padding → {semantics.spacing.10}`) is now exported into `tokens.json`, but the CSS transform does **not** consume it. Every component built so far binds straight to *semantic* vars (`var(--size-40)`, `var(--spacing-10)`), skipping the Component and Variant levels of the 4-level cascade described in `CLAUDE.md` / `MAX-CORE-SUMMARY.md`.

**Option 1 — wire component vars in.**
Add an `emitComponents()` to `packages/tokens/src/transform.ts` that emits each component token as a `var(--semantic)` *alias* (not a resolved literal), preserving the cascade:
```css
--atoms-buttons-global-size-m-padding:    var(--spacing-10);
--atoms-buttons-global-size-m-min-height: var(--size-40);
```
Then refactor components to read the component var (`px-[var(--atoms-buttons-global-size-m-padding)]`). Backfill the 5 existing atoms.
- **Pro:** faithful 4-level cascade in code; a consumer can rebrand *one* component (e.g. pad only buttons) without moving the global spacing scale.
- **Con:** +414 verbose vars, an indirection layer, a refactor of existing atoms. Names are tunable (`--btn-*` via a mapping table vs. the mechanical 1:1 path mirror).

**Option 2 — keep semantic vars (current state).**
Leave the components block as forward-compatible JSON only; components keep reading semantic vars.
- **Pro:** simpler, fewer vars, no refactor. A rebrand via primitives/semantics **still flows to components for free**.
- **Con:** loses *per-single-component* override granularity in code.

**What the Components collection is worth under each option:**

| | Role of the Components collection |
|---|---|
| Option 1 | A **runtime CSS layer** — emitted as `var()` aliases, components read them. |
| Option 2 | A **build-time spec** — the authoring lookup table ("which semantic token does each component property bind to?", which is what was consulted to build Button) **plus** a potential **drift-detection test** source (assert each component's code uses the alias the export records). Never emitted, never read at runtime. |

**Note for Option 2:** today use as a spec is *manual* and the drift check doesn't exist. To make the block earn its keep under Option 2, Phase 3 should add that conformance test.

**Related:** memory `project-archive-token-values-can-drift` (validate component values against the exported components block, not `CLAUDE-ARCHIVE.md`).

---

# Phase 3 — React component buildout (~40 components) — ✅ DONE

> **Status (2026-10-25): complete.** Batch 0 (foundation + drift gate) and Batches 1–7
> shipped 2026-07-13 — 46 components, drift-green, in tiered Storybook folders
> (Atoms/Molecules/Organisms × functional themes). The two carry-overs closed later:
> Batch 8 (Stacked List) shipped as a lean v1 under **Phase 4**, and the visual
> cross-check was done in **Phase 3.5** and re-done page by page in **Phase 4.5**.
> Pay Button (Batch 1) was later removed from the library by product decision.

## Context

Phases 1 & 2 are shipped: the token pipeline and 5 reference atoms (Button, Avatar, Badge, Tag, Input) that prove the architecture. Phase 3 scales the React library to cover the rest of the Max Core design system — **repeating the proven pattern ~40 times, consistently**, without letting per-component inline duplication (focus ring, tone map, state-layer overlay) metastasize.

**Locked decisions:** D1 = Option 2 (semantic vars, above); Step 0 foundation refactor first; mega-systems (Data Table, Date Picker, Bottom Sheet + premades) deferred to Phase 4.

## Convention (from the existing 5 — do not deviate)

- Folder `packages/react/src/components/<Name>/{<Name>.tsx, index.ts}`; barrel re-exports `{ Component, type ComponentProps }` from `src/index.ts` (`.js`-extension imports).
- Module-scope `cva([...base...], { variants, compoundVariants?, defaultVariants })`. Axes `variant`/`tone`/`size`/booleans. Tone-varies-by-variant → empty tone strings + compoundVariants; self-contained tone → classes on tone.
- Tokens read ONLY as arbitrary-value utilities (`px-[var(--spacing-10)]`). Font micro-steps may be literals; larger use Tailwind scale.
- Props `interface XProps extends Omit<ComponentPropsWithoutRef<typeof Base…>, '…'>, VariantProps<typeof xStyles> { slots… }`; `className={cn(xStyles({…}), className)}`; `...rest` to root. Icons = consumer-provided ReactNode slots. Base UI per-primitive subpath; `'use client'` only when wiring Base UI. One Storybook story per component (light + dark).

## Batch 0 — Foundation refactor + conformance (first)

New `packages/react/src/utils/`: **`focus-ring.ts`** (`focusRing` outset + `focusRingInset` = `before:-inset-[3px]` STRETCH ring for the Input frame per CLAUDE.md:237), **`tone.ts`** (`Tone` type + `toneVar` table + `toneCompounds(variant, role)` factory replacing the hand-written 12–16 compoundVariants), **`state-layer.ts`** (`stateLayer` `::before` overlay + `elevatePress`). Refactor Button/Tag/Badge/Input/Avatar onto them (behavior-preserving); Input gets the inset focus-ring fix.

**Drift-check** — `packages/tokens/src/conformance.ts` + `drift.ts` CLI (`tsx`; add `"drift"` script, wire into `turbo.json`/CI). Parse `components` block → family per key; resolve `{semantics.<group>.<key>}` → `--<group>-<key>`; exempt raw numbers + `{primitives.*}`. Assert `spec[family] ⊆ bound(component source)`; explicit family→component name table; unmapped families skipped → passes incrementally.

## Batches 1–7 (dependency- then complexity-ordered)

| B | Theme | Components |
|---|---|---|
| 1 | Button family | Spinner, Icon Only Button, Link Button, Pay Button, Split Button, FAB |
| 2 | Display atoms | Divider, Progress Bar, Tooltip, Knob*, Thumbnail, Content Blocks (Heading/Text/Image) |
| 3 | Selection & interaction | Checkbox, Radio, Switch, Segmented Control*, List Item |
| 4 | Input molecules | Input: Bottom Line, Select, Multiselect, Stepper, Textarea; Search Bar* |
| 5 | Composition I | List Item→Item List→Dropdown, Tabs, Pagination, Avatar Group, Range, Pin*, Switcher* |
| 6 | Entity & overlay | Entity Item→Entity Card, Form Group, Toast/Snackbar, Dialogs |
| 7 | Organisms (simpler) | Top Bar (Desktop+Mobile), Side Bar, Bottom Nav, Stats Card (S+Big), Share Item |
| 8 | Stacked List | Stacked List — 9 row types (split out of Batch 7: mega-system, per the risk note below) |

Hard deps: `List Item→Item List→Dropdown`; `Entity Item→Entity Card→Stacked List`; `Avatar→Avatar Group`; `Selection→Form Group/Stacked List`; `Input base→all Input variants/Search Bar/Stepper/Form Group`. `*` = semantics/headless choice needs a 1-line Figma decision (see Risks).

**Base UI mapping:** button-based (Icon Only/Link→`<a>`/Pay/Split+`menu`/FAB+`menu`) → `button`; `separator`/`progress`/`tooltip`/`checkbox`/`radio`/`switch`/`tabs`/`select`/`combobox`(Multiselect)/`number-field`(Stepper)/`slider`(Range)/`toast`/`dialog`+`alert-dialog`/`menu`(Dropdown)/`fieldset`+`field`(Form Group). Custom: Spinner, Thumbnail, Content Blocks, Pagination, Avatar Group, List Item, Item List, Entity Item/Card, Stats Card, Stacked List, Share Item, bars. Textarea = native `<textarea>` + `field`.

## Per-batch verification (before each commit)
typecheck + tsup build pass · Storybook story per component with `AllVariants`, light **and** dark · Figma parity via MCP (`get_design_context`/`get_screenshot`, `figma-design-to-code` skill) · `drift` green for the batch · Biome clean · one commit per batch on a feature branch.

## Risks / gates
- **Base UI subpath availability** (before B3–B5): resolve-check `toggle-group`, `combobox` multi-select, `number-field`, `toast`, `collapsible`, `otp-field` in `@base-ui/react@1.5.0`; missing → custom fallback.
- **forwardRef gap** — the 5 atoms use none, but Tooltip/Menu/Dialog triggers need forwarded ref / `render` prop. Set the convention at B1/B2.
- **Unclear semantics** (1-line Figma decision): Knob (B2), Segmented Control headless choice (B3), Switcher (B5), Search Bar suggestions (B4), Pin OTP-vs-custom (B5).
- **Stacked List** — 9 row types; compose from List Item + Entity Item + Selection. RESOLVED: split into its own **Batch 8** (mega-system, ~22 tokens across distinct row layouts).
- **Providers** — Toast/Dialog need Provider/portal; decide ship-vs-document (affects B6 Storybook decorators).
- **Drift exemptions** — organism `primitives.opacity.*` and raw-number tokens have no semantic var; exempt to avoid false positives.

## Out of scope (Phase 4)
Data Table system, Date Picker, Bottom Sheet + 18 premades. Automated test infra (vitest/axe) stays deferred — drift check is Phase 3's only automated gate.

---

# Phase 3.5 — Visual cross-check against Figma showcases — ✅ DONE (2026-08), superseded

Cross-checked 12 designer-exported showcase files (Buttons, Badge, Tag, Selection
Controls, Payment Buttons, Segmented Control, List Item, Search Bar, Dialog, Top Bar,
Bottom Bar, Side Bar) against React. Every one was drift-green yet missing axes or
states the token export doesn't carry. **Superseded by Phase 4.5**, which re-audited every
component (these 12 included) against the live Figma masters. The lesson carried over:
the drift gate guarantees dimensions, never appearance, and bound variables beat
description text.

---

# Phase 4 — Mega-systems — ✅ DONE (2026-10-25)

> The large composite systems deferred out of Phase 3. Component specs already exist on the Figma
> side in **`docs/MAX-CORE-SUMMARY.md`** (Data Table System, Card System, Bottom
> Sheet System) — this phase builds their React counterparts. Live status is
> tracked in **`PROGRESS.md`** as batches land.
>
> **Status (2026-10-25): complete.** Batches **8 (Stacked List)** and **9 (Data Table)**
> shipped as **lean v1s**, **10 (Card)**, **11 (Bottom Sheet)** and **12 (Date Picker)**
> landed — see the per-batch notes below and `PROGRESS.md`. What the lean v1s left out
> is listed in the **On-demand backlog** at the end of this file. The test-infra batch
> (formerly Batch 13) moved to its own **Phase 6**. Also landed: the **contrast
> guardrail** (`pnpm -F @max-core-ds/tokens contrast`, WCAG AA text/bg pairings,
> light+dark), which pre-empts part of Phase 6's a11y goal.

## Scope

Everything here is composite or infrastructural — it depends on the atoms and
molecules shipped in Phase 3, so it was held back until those stabilized.

### Batch 8 — Stacked List *(carried over from Phase 3)* — ✅ lean v1
9 row types — Default, Social, Ride Row, Delivery Row, Media Row, Product,
Booking, Items Grid, Transport. Compose from `ListItem` + `EntityItem` + atoms.
**Shipped:** `StackedList` (bordered/divided container) + one variant-driven
`StackedListRow` covering **default / social / media / product** (4 of 9). Files:
`packages/react/src/components/StackedList/`. **Deferred:** ride/delivery/booking/
item-grid/transport row types (add variants on demand).

### Batch 9 — Data Table system — ✅ lean v1 (core)
**Shipped** (`packages/react/src/components/DataTable/`): a column-config
`DataTable<Row>` (`columns` + `data`, client-side or controlled `sort`,
hover/`selectedRowId` highlight, `onRowClick`) with **`selectable` row selection
+ select-all**, an optional **`header`** slot and **`footer`** slot (drop in
`<Pagination/>`), plus exported primitives **`Table` / `HeaderCell` / `TableRow`
/ `TableCell`** and a **`RatingStars`** cell helper. Sort chevrons + selection
column cross-checked against the Table Builder master. Contrast-verified via
`OVERRIDES` in `contrast-audit.ts`.
**Deferred:** mobile scroll variant + "Load more"; `_Table Row Expanded`; the
stats/tabs **Table Header** content (callers compose it into the `header` slot);
the 5 prebuilders (Invoice, Users, Tickets, Products, Transactions).
- Design rules already fixed: background on row (not cell) for full-row states;
  height fixed per density; row has no own tokens (dimensions come from cells).

### Batch 10 — Card system — ✅ landed (2026-10-25)
- **`Card`** (= `_Card`) — `elevation` none / low / high (shadow down sm / md), optional
  header (`title` + `onClose` ✕), Body Content (`children`, Body Gap 16), `actions` in an
  Action Bar. The current master has no Show Header/Footer booleans; optional props cover it.
- **`MediaCard`** (= `_Media Card`) — `media` (240 tall, bg/subtle), `badge` (top-left 12/12),
  `title` / `meta` (Show Date) / `description` / `children`, right-aligned `action`.
- Stroke drawn as an overlay (Figma INSIDE stroke takes no space). Drift spec `Card`.

### Batch 11 — Bottom Sheet system — ✅ landed (2026-10-25)
- **`BottomSheet`** (= Bottom Sheet Builder) on Base UI `Drawer` (modal, Esc / outside
  press / swipe-down dismiss): `handle`, `title` + `showClose`, Body (`children`, no
  padding), `footer` (equal columns, 16 apart). Shadow up/md, radius 2xl top-only,
  bottom padding 32 or the safe area. Drift spec `Bottom Sheet`.
- **Premades** = Storybook recipes (`Premade` story, Type as a control): 13 of 18. Transport /
  Map, Ride ×2, Booking / Place List wait for their Stacked List rows; Sort duplicates
  Settings in the master. See `docs/audit/bottom-sheet.md`.

### Batch 12 — Date Picker — ✅ landed (2026-09-17, commit `d17a0b7`)
React counterpart of the Figma Date Picker (Calendar + Header + Footer; Date /
Dual / Input variants). Shipped `DatePicker` / `DualDatePicker` / `DateInput` on
**`react-day-picker@9`** restyled onto tokens via `classNames`/`components` (no CSS
import, kept `external`); ISO-string public API via a `date.ts` `Date↔ISO` adapter;
custom `MonthCaption` header with month/year **drill-down**; drift-green. Day picker
cross-checked against the Figma master; **month/year render as grids — Figma
scroll-wheels deferred** by decision. See PROGRESS.md + memory
`project-datepicker-react-build`.

### ~~Batch 13 — Test infrastructure~~ → moved to **Phase 6**

## Sequencing

Stacked List ✅ → Data Table ✅ (both lean v1) → Date Picker ✅ (Batch 12) →
Card ✅ → Bottom Sheet ✅. Return to the deferred items (**On-demand backlog**,
end of this file) when the real project needs them.

## Out of scope for Phase 4
Layer 3 component-level token bridge (the `components` collection is still read
for drift but not yet re-wirable per slot); publishing to npm; CI/CD; Figma
plugin Community listing. These are productionization concerns tracked in the
README "Status" gaps, not component work.

---

# Phase 4.5 — Component audit: Figma doc page ↔ React — ✅ COMPLETE (2026-10-25: Atoms, Molecules, Organisms — 40 pages; before Batch 10)

> **Why:** Phase 3.5 only covered the 12 files the designer exported, and it focused on
> missing axes and colours. The List Item / Item List re-check (2026-10-23) showed that even
> ✅ components drift: typography, structure, and props that were invented or are missing.
> The focus-ring review (2026-10-24) turned up a cross-cutting gap too. Before building new
> systems (Card, Bottom Sheet), we audit **every shipped component** against its **Figma doc
> page**, page by page, from `figma-node-links/catalog.json`.
>
> Live status: the **Audit status** table in `PROGRESS.md`. Findings per page:
> `docs/audit/<slug>.md`.

## Ground rules
- **The Figma master's bound variables are ground truth.** Doc-page text is the spec of
  intent, but it can be stale. When they disagree, the binding wins and the stale doc text
  goes on the designer list. (Recipe: memory `reference-figma-recheck-recipe`.)
- **Figma is read-only during the audit.** No `use_figma` writes unless the user approves
  that specific change. Figma-side issues go under "For the designer" in `PROGRESS.md`.
- **Never hand-edit colour values in `tokens.json`.** Fix contrast in component code (with a
  comment) or flag it to the designer.
- **One page = one audit doc, one review with the user, one commit** (the user pushes).
- File: working file `sX5tikviuBEhNbu2iPVya5`. Call `create_session` first; re-auth via
  `/plugin` if MCP auth dropped.

## Per-page process
1. **Read the doc page.** Use the catalog `nodeId`. Run `get_screenshot` on the
   `… Documentation` frame, and `node figma-node-links/query-tree.mjs "<master id>" 3` to get
   the description and anatomy text.
2. **Read the masters.** Run a read-only `use_figma` over each master/set in the page's
   `masters[]`:
   - `componentPropertyDefinitions` (variants, booleans, slots, instance swaps)
   - per-variant fill/stroke colour bindings
   - padding, gap, radius and stroke-weight bindings
   - TEXT `textStyleId` and fills
   - focus mechanism (`.Focus-ring` instance vs ad-hoc `Focus` rectangle vs none; State
     value vs BOOLEAN)
3. **Read the React side.** Component source, its CVA/utils, and its story. If the visuals
   are in question, take Playwright screenshots of Storybook, light and dark.
4. **Fill the checklist** below in `docs/audit/<slug>.md`. Each item is ✅, ❌ + finding, or
   n/a. Classify every finding as **code fix**, **designer (Figma)**, or **deliberate
   deviation** (with the reason).
5. **Review with the user.** Present the findings and agree on the fix list.
6. **Fix the code.** Run the verify gate (`PROGRESS.md → Verify a change`) and update the
   story (only the stories Controls can't show), then **commit** with a message naming the
   findings. Tick the page in `PROGRESS.md`.

## Checklist (per component)
| # | Area | Compare |
|---|------|---------|
| 1 | **API / axes** | Figma variant props, booleans, slots, instance swaps ↔ React props. Names, values and defaults. Flag invented and missing props. |
| 2 | **States** | Default / Hover / Pressed / Disabled (+ Active / Selected / Validation where applicable). Disabled = opacity layer, not separate colours. |
| 3 | **Colours** | Per-state fill / stroke / text token *names* (not hex). |
| 4 | **Dimensions** | Padding / gap / radius / size / border weight bindings ↔ classes (drift covers most of this; also check unbound values). |
| 5 | **Typography** | Text style per text node (drift never sees this). |
| 6 | **Anatomy** | Sub-components / internals / slot structure and order. |
| 7 | **Focus (hybrid model)** | Bordered **field** → own border `border/focus` 2px, React `focusBorder`, no ring. **Pressable** → `.Focus-ring` instance in Figma, React `focusRing` (keyboard-only `focus-visible`). Focused = BOOLEAN. Disabled = no focus. Ring covers only the focusable area. |
| 8 | **A11y** | Semantic element / role / aria, keyboard interaction, contrast (`pnpm -F @max-core-ds/tokens contrast`). |
| 9 | **Doc page accuracy** | Doc text vs master (stale token names, usage lists, counts) → designer list. |
| 10 | **Story** | Exposes every axis via Controls, plus matrix stories only where needed. |

## Known findings to seed (from the 2026-10-24 focus review)
- Inputs: `.Focus-ring` instances in the Input frames (about 81) → remove them in Figma (designer),
  and React `Input` / `Textarea` `focusRingInset` → `focusBorder`. `SelectInput` uses the
  outset `focusRing` (wrong for a field). Check Multiselect, Stepper, SearchBar,
  BottomLineInput, the DateInput / TimePicker triggers.
- Button / Pagination / Data Table use ad-hoc `Focus` rectangles instead of `.Focus-ring`.
  Button, Link Button and FAB have `State=Focused` variants (should be a BOOLEAN).
- Selection Controls: 43 `.Focus-ring` instances overridden to 1px. List item: 8 instances
  bound to `/thick`. Unify these.
- Switcher / Tabs / Range / Date Picker day cells have no focus in Figma (the rings were
  reverted on 2026-09-13).
- `DatePicker.tsx` / `TimePicker.tsx` repeat ring classes inline instead of using the
  shared util.
- `.Focus-ring` (`24:797`) component description is still the 2026-10-24 hybrid text (the
  original was lost). Restore it from Figma version history, or leave it.
- Figma `.Focus-ring` is 1px; React rings are 2px. Decide in the Buttons audit (designer).

## Order (catalog tier order ≈ dependency order)
**Atoms:** Buttons (Button, IconOnlyButton, SplitButton, Fab, LinkButton) → Selection
Controls (Checkbox, Radio, Switch) → Segmented controls → Tag → Badge → List item → Knob →
ScrollBar (+ ScrollArea) → Time picker → Tooltips → Divider → Spinner → Progress Bar →
Status Dot → Avatar → User (no React counterpart: check whether EntityItem covers it) →
Thumbnail → Content blocks.
**Molecules:** Inputs (Input, BottomLineInput, Stepper, Textarea, SelectInput, Multiselect)
→ Search bar → Item List → Dropdown → Form Groups → Date picker → Tabs (Switcher, Tabs) →
Pagination → Range → Entity Item → User card (EntityCard) → Avatar group → Pin → Action bar
→ Toast/snackbar → Dialogs.
**Organisms:** Top Bar → Side bar → Bottom Navigation → Stacked List (+ ShareItem) → Stats
card → Data table.

**Skipped:** Foundations pages, Logo, Pay buttons (removed from the library), Focus ring
(foundation, covered by checklist row 7). Widget card and Bottom sheet have no React yet;
they are Phase 4 Batches 10/11 and get built against the same checklist.

## Verification
- Each page: an audit doc with every checklist row filled, the verify gate green, the
  contrast count no worse than before, and Storybook screenshots matching the Figma
  screenshot in light and dark.
- Phase done when every non-skipped page is ✅ in the `PROGRESS.md` Audit status table and
  the designer list is consolidated.

---

# Figma as the single source — Phases 4.6 / 4.7 / 4.8 (planned 2026-11-09)

> Each subphase ends with a report to the user and waits for their go-ahead.

## Context
Max answered (`~/projects/max-core-answers-for-dev.md`): **everything in Figma drives the code**:
- text styles
- font family
- all 20 effect styles
- the whole Primitives collection (z-index, motion, breakpoints, …)
- **the 720 component tokens** (Q8: "the code should read the component tokens directly")

He also made three rounds of fixes in the **working file `sX5tikviuBEhNbu2iPVya5`**, including accent ramp, text colours, states, API changes and new tokens.

The order the user chose: **(A) exporter → (B) one pass per component → (C) publishing pipeline.**
The token format is stabilised first, each of the 55 components is touched once, and publishing is automated on the final format.

Phase renumbering in `PLAN.md`:
- Phase 4.6 = A
- Phase 4.7 = B (absorbs Phase 5 cap-trim)
- Phase 4.8 = C
- Phase 6 tests unchanged

Step 0 of execution: copy this plan into `PLAN.md` and `PROGRESS.md` (memory rule: plans live in the repo). Also save Max's answers in the repo as `docs/figma-answers-round-1.md`; it's the spec for Phase 4.7.

---

# Phase 4.6 — Full export (exporter + CSS generator) — ✅ DONE (2026-11-09)

> **Status (2026-11-09):** 4.6.1 ✅ inventory · 4.6.2 ✅ plugin (v0.4.0; warns on aliases to
> variables in no collection — 4 Form Group premade tokens → Max) · 4.6.3 ✅ types · 4.6.4 ✅
> `tokens.css` (1113 vars) + `theme.css` (18 utilities), existing vars byte-identical · 4.6.5 ✅
> re-exported from `sX5tik…` and synced (Max's colour ramp in; only component *value* change:
> Item List Gap 8 → 4); apps import `theme.css`, body font = `--typeface-family-base`; cap-trim
> measured = Figma (Caption 9, Body/SM 10). Contrast 19 → **12** components. Drift follows
> `{components.*}` chains; **red on purpose** for Max's plain → alias rebinds (Input / Select /
> Bottom Line / Textarea / Multiselect min sizes, Tag S min height, Toast Content Gap, Card) —
> fixed in each component's Phase 4.7 pass. 4.6.6 ✅ drift: unknown-var check (every `var(--…)` in
> react/src must be defined; Base UI / Tailwind runtime vars allowlisted) + per-spec
> `mode: 'component'` (binds its own component vars) for Phase 4.7; contrast extractor reads the v4
> `bg-(--x)` shorthand (no component token is a colour, so nothing else to follow).

### 4.6.1 Inventory (read-only, `use_figma` on `sX5tik…`)
List every variable name and type per collection and mode, all text styles (with bound vars, fontName, lineHeight, letterSpacing, leadingTrim) and all effect styles (with layer types and their fields, including the Glass effect's API fields).

The output goes to the scratchpad and fixes the exact name→path mappings below. No Figma writes.

### 4.6.2 Plugin (`packages/figma-plugin/src/transform.ts`)
- **Primitives and semantics, fully generic.** Keep today's special-cased paths (spacing, radius, border-width, opacity, color), so the existing `{primitives.*}` / `{semantics.*}` references and CSS names don't change. Every other variable falls back to its own name path, slug-cased, instead of being dropped (`return null` today):
  - `zIndex/dropdown` → `primitives.z-index.dropdown`
  - `motion/duration/fast`
  - `motion/easing/default` (string)
  - `breakpoint/*`, `container/max/*`, `grid/*`, `tapArea/min`, `focus/*`, `text-size/size/*`
  - `- Typeface family -/base|brand|mono` → `semantics.typeface-family.*` (string)

  The one exception is `icon/size/*`, which Max says to skip.
- **Components:** keep the alias reference to the *nearest* token, not only the first semantic. A level‑4 → level‑3 alias becomes `{components.<key>}`, so the component cascade survives into CSS (`firstMappableRef` is kept as the fallback). Also emit **string and colour component tokens** if the inventory shows any.
- **New `typography` block**, from `figma.getLocalTextStylesAsync()`. For each of the 15 styles:
  - `fontFamily` reference (`{semantics.typeface-family.base}`) and `fontSize` reference (`{primitives.text-size.*}`), from `boundVariables`
  - `fontWeight` mapped from `fontName.style` (Light 300 / Regular 400 / Bold 700 / Black 900)
  - `lineHeight` (%)
  - `letterSpacing` (%)
  - `leadingTrim`
- **Effects:** keep the drop/inner shadows and add:
  - `LAYER_BLUR` / `BACKGROUND_BLUR` → `{ type: 'blur', radius }`
  - the Glass effect → `{ type: 'glass', blur, … }` with the raw fields kept, plus the existing shadow layers for `glass/elevated`
- `$version` becomes `0.4.0`. Update `countTokens` and the UI summary with the new counts (typography, effect kinds).

### 4.6.3 Types (`packages/tokens/src/types.ts`)
- Add `typography`, `EffectLayer = shadow | blur | glass`, and open semantics/primitives trees.
- Fix the package export `./types` (currently points at `src/types.ts`, which isn't shipped). This step is pulled forward from Phase 4.8.

### 4.6.4 CSS generator (`packages/tokens/src/transform.ts` → `dist/tokens.css` + new `dist/theme.css`)
- **`tokens.css` (plain CSS, any consumer):**
  - Existing semantic and colour vars, unchanged.
  - New:
    - `--z-index-*`, `--motion-duration-*`, `--motion-easing-*`
    - `--breakpoint-*`, `--container-max-*`, `--grid-*`, `--tap-area-min`, `--focus-width|offset`
    - `--typeface-family-base|brand|mono` (with a fallback stack after the Figma family)
    - `--text-size-*`
  - **Component vars**, emitted as `var()` references so they cascade and a theme can override at any level. For example `--buttons-global-size-s-padding: var(--spacing-06);` and `--stepper-padding-x: var(--input-global-general-padding-x);`.
    - **Naming:** drop the tier prefix (`-- Atoms/`, `-- Molecule/`, `--Organism/`), then slug the rest.
    - Collisions are checked at build time and fail loudly; if any occur, keep the tier prefix for those names only.
    - Raw numbers are written in `px`; opacity values stay unitless.
  - **Effects:** shadows as today. Blur becomes `--effect-blur-*: blur(Npx)`. Glass becomes `--effect-glass-*-backdrop: blur(N) saturate(…)` plus `--effect-glass-*-edge` (a 1px light edge) and `--effect-glass-elevated-shadow`.
  - **Typography composite vars** per style: `--type-body-sm-300-font`, `-size`, `-weight`, `-line-height`, `-letter-spacing`.
- **`theme.css` (Tailwind v4 layer, generated):**
  - `@theme` maps: `--font-base` / `--font-brand`, the shadow, blur and ease names, and the breakpoints from tokens.
  - `@utility` per text style: `type-h1 … type-caption-xs`. Each sets font, size, weight, line-height and letter-spacing, plus the cap-trim from Max's Q2: `text-box: trim-both cap alphabetic`, inside `@supports`. Without support the full line box stays (no padding hack).
  - `@utility glass-base|strong|elevated` and `bar-blur-*` (the backdrop approximation from Q4).
  - This file replaces "the code's own type scale".
- `cli.ts` writes both files. `scrollbar.css` is unchanged.

### 4.6.5 Re-export + sync
1. Build the plugin. **You** run it in Figma Desktop on `sX5tik…`; it downloads `tokens.json`.
2. Run `pnpm -F @max-core-ds/tokens sync --dry-run`, then `sync`, then `build`.
3. Review the diff: Max's colour changes arrive here (accent ramp, `text/secondary` / `text/muted`, `overlay/scrim`, `chart/*`, `opacity/faint`, new component tokens).
4. Reconcile the plain-number list against Max's 15 (send him our list if it differs).

### 4.6.6 Guardrails updated
- **`drift.ts` / `conformance.ts`:** the rule changes from "binds the semantic vars its Figma tokens mandate" to:
  1. every `var(--…)` in a component exists in `tokens.css` (catches typos and renamed tokens after a re-export)
  2. per family, each component token is referenced by its owner component, or is listed as exempt with a reason
- Until Phase 4.7 migrates a component, its old semantic-var check stays on. Each component switches mode as it is migrated.
- **`contrast-audit`:** resolves component colour vars too. Re-run it after the sync; Max's ramp should clear most of the 30 findings.

---

# Phase 4.7 — One pass per component (55 files) — 🔄 IN PROGRESS (2026-11-09; batches 1–5 = all Atoms done by 2026-11-11, `d1df222`; batch 6 inputs done 2026-11-11)

> **Batch 1 — Buttons ✅ (Button, Icon Only, Split, Link, FAB):** all five on their own component
> vars (drift `mode: 'component'`); labels on `type-*` + a cap-trimmed label span
> (`utils/cap-trim.ts`) — label boxes measure exactly as the masters (S 9px @ y 11.5 … XL 12px @ 22);
> Link Button with icon 28px = master. Secondary/Ghost Default → `text/accent` (dark contrast
> fixed); Primary/Secondary border widths bound to their tokens; FAB states = fill swaps
> (`accent/hover` / `accent/active`, no state layer); Link Default tone flat `text/accent` (as the
> master); shared focus ring reads `focus/width` / `focus/offset`.

> **Batch 2 — Selection Controls + Segmented Control ✅ (Checkbox, Radio, Switch, Segmented):**
> own component vars (drift component mode); labels Body/SM/300 on all three wrappers (Switch was
> Body/MD), helpers Caption/300, cap-trimmed; unchecked Hover/Pressed = light tints
> (`accent/surface` / `accent/subtle` + `border/accent`; status validations keep their subtle
> fill); Switch Pressed knob stroke `border/accent`; Segmented strokes as inset rings so the bar /
> item hug 42 / 26 exactly as the master (a CSS border made it 44); active item stroke bound to
> Item/Border Weight.

> **Batch 3 — Tag + Badge ✅:** own per-size component vars (Tag S Min Height now its token —
> clears that drift failure); labels Caption/300 in a cap-trimmed span. Badge renders 23 / 27 / 31
> = the master's 21 / 25 / 29 frame + its OUTSIDE 1px stroke (was 28 / 32 / 36). Tag's stroke is
> INSIDE, so the border width comes out of the padding (`calc`): exactly 28 / 32 with or without
> icons. Default-tone labels → `text/accent` (Tag Primary-off was `accent/active`, Ghost + Badge
> Outline/Ghost `accent/default`); Badge Outline border → `border/accent`; Tag hover / pressed
> overlay opacities → `- opacity -/hover` / `/pressed`.

> **Batch 4 — small atoms ✅:** Tooltip (+ Range bubble, shared util), Divider, Spinner,
> Progress Bar (+ Range track, shared util), Knob, ScrollBar, Status Dot on their own component
> vars, all drift `component` mode. Tooltip bubble → `type-caption-300` (cap-trim unchanged, 41px);
> Progress range labels + Spinner % → `type-*` + cap-trim span. Max's changes: Spinner Inverse %
> label → `text/on-accent`; ScrollBar thumb → `neutral/subtle` (atom, rail, and the
> `.styled-scrollbar` utility; its hover → `neutral/active`); Knob pressed ring width →
> `- Border Weight -/thin`; Progress fill radius follows the per-size track radius. Exempt with
> reasons: Spinner Track/Indicator Stroke (never render), Progress Global Border Weight (none) +
> Global Radius (reached via Size */Radius). Contrast unchanged (12/34, none in this batch).

> **Batch 5 — remaining atoms ✅:** Avatar, Avatar Group, Thumbnail, List Item, Pin, Time Picker,
> Content Blocks on own component vars, all drift `component` mode. Avatar initials → `type-*`
> per size (Caption/700, Body/MD/700, H6, H5) cap-trimmed; status dot → Avatar Size */Status Dot
> Size + Global/Status Dot Border Weight. **Thumbnail `status` prop** (Figma `Show Status`) —
> no longer clips (image rounds itself) so the dot can sit on the box corner; binds the Avatar dot
> tokens like the master. Avatar Group: Gap / Avatars Radius / Border Weight / Counter Size (at XS).
> List Item + `listItemOption` (Select / Multiselect / Dropdown rows): `type-caption-700/300`
> cap-trimmed → rows measure the master's 44px; Dropdown label wrapped in a span so it trims.
> Pin tail → `text/accent` (as the master). Time Picker: centre value → `text/accent` (Max), Gap /
> Items Gap / Container Padding / Radius / Border Weight tokens; rows keep line-box heights as tap
> targets (master stacks cap-trimmed 9–12px rows) with the label trimmed and centred — deliberate.
> Content Blocks: H6 / Body/SM/300. Contrast 12 → 11 (Time Picker selected now `text/accent`).
> z-index tokens: sweep all `z-50` / `z-[…]` once at the end of 4.7 (9 sites).

> **Batch 6 — input molecules ✅ (Input, Textarea, Bottom Line, Select, Multiselect, Stepper,
> Search Bar + `utils/field.ts`):** every dimension on the component's own level-4 vars
> (Padding X/Y minus the INSIDE stroke, Inner Gap, Items Gap, Radius, Stroke Weight, Min Width /
> Min Height, Icon Size, Stepper Hit Area / Number Min Width; Search Bar Global + Size *), all
> drift `component` mode — clears the last input drift failures (red now only Toast + Card,
> later batches). Max's changes: value + placeholder `fieldText` S Caption/300 · M Body/SM/300 ·
> L Body/MD/300 (inputs + Search Bar); titles `type-body-md-700` (Stepper too, no longer per
> size), helpers/errors `type-caption-300` → cap-trimmed 12 / 9px boxes, so wrappers measure the
> master (Input S 12 + 8 + 40 + 8 + 9 = 77); Stepper number Caption/700 `text/primary`; chips =
> Badge S Default on `--input-multiselect-badge-*`, Caption/300 cap-trimmed, stroke as an
> outline (the master's OUTSIDE stroke) → field 45 as the master; Bottom Line `Padding X`.
> Rows are Icon Size tall (the `<input>` gets `h-(icon)`), so heights no longer depend on line
> boxes: 40 / 44 / 56, Textarea 120, Multiselect 45 / 45 / 56, Search Bar 32 / 40 / 48 (measured).
> `fieldBorder` no longer carries a width (each component binds its Stroke Weight; `fieldSurface`
> keeps `border`); `fieldRoot` no longer carries the gap (DatePicker adds 8 itself until its batch).
> Left as is: Multiselect typeahead popup (own invented list, raw semantic vars) → Item List batch.
> Contrast unchanged (11/34).
>
> **Batch 7 — overlay + navigation molecules ✅ (Toast, Dialog, Tabs, Pagination, Switcher, Item
> List + Multiselect typeahead popup):** all on their own `--toast-snackbar-*` / `--dialogs-*` /
> `--tabs-*` / `--pagination-*` / `--switcher-*` / `--item-list-*` vars, drift `component` mode —
> Toast's missing Content Gap (10) is now bound, so drift is red only on Card. Text: Toast title
> `type-h5` + body `type-body-sm-300`, Dialog `type-h4` + `type-body-sm-300`, Tabs / Switcher
> labels `type-body-sm-300` (Switcher active 700), Pagination numbers `type-body-sm-700`, Select
> all `type-caption-700` — all cap-trimmed. Followed the master where it moved since 4.5: Tabs
> Active = `text/primary` label + `- Border Weight -/thick` `border/accent` underline (bottom
> padding gives the stroke back → 34 tall); Switcher Hover / Pressed fill `neutral/subtle`
> (label stays `text/secondary` on hover); Pagination ellipsis = the button box (Type=Ellipsis,
> `text/muted`, not interactive); Toast Dismiss = `IconOnlyButton` Ghost / Default / S (was a
> bare ×, no focus ring); per-tone Toast strokes bound (Border Weight is none, so invisible).
> Switcher items keep a min height of Icon Size + padding so icon-less items stay 32 (a hugging
> Figma item drops to 26). Multiselect typeahead popup now = header-less Item List with Checkbox
> List Item rows, 8px below (same as list mode); its invented list + CheckIcon removed. Kept:
> Item List no shadow (2026-10-24 decision) and its 4px inset (now the Gap token). Measured:
> Tabs 34, Pagination 32, Switcher 32 / 40, Toast title 18, Dialog title 22 / body 10.
> Contrast unchanged (11/34).
>
> **Batch 8 — Dropdown, Range, Entity Item, Entity Card, Form Group ✅:** all drift `component`
> mode with zero leftover semantic vars. Entity Item Gap / Label Gap; titles `type-body-md-700`
> (User) / `type-body-lg-700` (Workspace), subtitle `type-caption-300` → 12 / 13 / 9 as the
> master; Entity Card Padding X/Y, General Gap, Radius, nested User title `type-body-sm-700`,
> chevron box on the Icon Only S tokens (56 tall, measured). Dropdown rows' icon on
> `--list-item-icon-size`; Gap + Item List Padding exempt (numeric sideOffset / left-only slip).
> Range on Knob Size / Radius, Progress Bar Item Gaps + S Height, Tooltip Knob Gap; bound labels
> Caption/300 cap-trimmed → 31 tall (was 37.6). Form Group Size */Gap + Items Gap (S = Global),
> Headline Gap, Action Buttons Gap; title `type-h5` / `type-h4`, description `type-body-sm-300`;
> premade = Premade/Global Size */Padding (L now 40 — the token is in the export), Radius,
> Border Weight (none) + `border/default` stroke as the master; per-type premade tokens alias
> Global (spec takes Global/Size/Premade-Global prefixes; Content Width exempt). Contrast
> unchanged (11/34).
>
> **Round-1 catch-up (after Batch 8):** three of Max's round-1 answers missed in Batch 7 —
> Item List carries `effect/shadow/down/md` (so every popup on it: Select, Multiselect,
> Dropdown; reverses the 2026-10-24 no-shadow decision, user OK); Dialog + Bottom Sheet
> backdrops on `overlay/scrim` (was `bg-black/50`); Toast `Show Dismiss` → `data: { showDismiss:
> false }` (exported `ToastData`). Lesson: re-read `docs/figma-answers-round-1.md` for each
> batch's components before closing it.
>
> **Batch 9 — Date Picker + Card ✅ (drift now fully green, exit 0):** Card on `--card-base-*` /
> `--card-media-*` (Padding, Items / Header / Body Gap, Radius, the new Border Weight on the
> overlay stroke; Media Image Height, Min Width, Content Gap, Footer Gap), H6 / Body/SM/300 /
> Caption/300 meta via `type-*`; exempt Base Footer Gap (the Action Bar's own gap) + Action
> Radius / Padding X (bound nowhere). Round 1: the Card and Bottom Sheet ✕ are now Ghost S
> `IconOnlyButton`s (`utils/close-button.tsx` keeps only the icon). Date Picker on
> `--date-picker-*` (Container Radius, One Calendar Min Width, Day Item Padding / Radius /
> Today Radius / Today Item Size / Border Weight, Header Padding X/Y + Month Year Action Gap,
> Footer Padding X/Y (bound since round 1 — was 12 all round, now 16 / 12) + Gap, Picker Grid
> Rows Gap, Today Padding), Today ring `border/accent` (round-1 sweep); days / labels
> `type-caption-700`, weekdays `type-caption-300` (29 tall). DateInput's trigger is now the Base
> Input frame itself (`baseInputFrame` / `baseInputItemsGap` exported from Input.tsx, not public)
> + `fieldText` → 40 / 44 / 56 like the other fields. Exempt: Container Border Weight (pane keeps
> its 1px border pending round 1's "Input pane border"), Input Date Picker Gap (numeric
> sideOffset), Container Padding (weekday cells share the column), Sub Text Gap (no price label).
> Contrast unchanged (11/34).
>
> **Batch 10 — bars ✅ (Top Bar, Side Bar, Bottom Navigation):** all drift `component` mode.
> Round 1 applied: every translucent surface is `bg/surface` at its Background opacity token
> (`--top-bar-global-background-opacity`, `--side-bar-background-opacity`, via `color-mix`) +
> `effect/blur/md` (`backdrop-blur-effect-md` = 12px; was `backdrop-blur-xl` 24) — Top Bar
> Desktop + floating circles and Side Bar move off `bg/brand`, Side Bar gains the blur; Bottom
> Navigation Items Gap + Dot Size; its Active content `text/accent` (was `accent/default`, too
> dark in dark mode) → contrast **10/34** (BottomNavigation passes). Top Bar Desktop / Mobile
> Padding X/Y + Item Gap (slots too), Global Radius + Border Weight on the inset stroke, Mobile
> Radius + Icon Size; titles `type-h4` (floating) / `type-h5` (standard, capTrim span). Side Bar
> Width Expanded / Collapsed, Gap, Padding, Expanded Padding (collapsed gap, as bound), Body
> items gap, Radius, Border Weight. Bottom Navigation bar Padding (top gives back the INSIDE
> stroke → 72), Radius, Border Weight; nav item Padding X/Y, Gap, Radius, Icon Size; label
> `type-caption-300`. Measured: Desktop 88, Bottom Navigation 72 / items 56. Exempt: Top Bar
> Global Padding / Item Gap (reached via the Desktop / Mobile aliases) and Desktop / Mobile
> Border Weight (alias Global, which the stroke binds).
>
> **Batch 11 — Stacked List, Stats Card, Data Table, Bottom Sheet (+ Action Bar, Share Item) ✅:**
> every mapped drift spec is now `component` mode. Bottom Sheet on `--bottom-sheet-*`; round 1:
> parts General Gap (24, was 16) apart, header Header Gap, and the master's Divider above the
> footer; title `type-h6`. Stacked List: per-row-type tokens (Padding, Gap, Inner Gap, Border
> Weight — stroke kept at none as Max asked —, Item Size / Radius, Media Icon Size); Default's
> leading icon is now the bare 24 icon as the master (was a 32 box); title `type-body-md-700`,
> subtitle `type-caption-300`, price `type-h6` → rows 56 / 80 measured. New `truncateTrimmed`
> (`utils/cap-trim.ts`): `overflow-x: clip` + ellipsis, because `truncate`'s overflow hidden
> clipped descenders under the cap trim. Stats Card: Global / Compact Padding + Item Spacing,
> Radius, Border Weight, Header Item Spacing, Legend Bottom Padding, Info Group Gap; chartTheme
> on Chart Line / Grid Stroke + Axis Gap; text `type-caption-700` / `-xs`, `type-h5` / `-h6`,
> `type-body-md-300`. Data Table: Header Cell Height / Min Width / Padding Y / Border Weight /
> Label Gap / Sort Icon Size, Table Cell Height / Min Width / Border Weight, Global Padding /
> Radius, Footer Padding + Desktop Gap, Rating Group Gap + Stars Icon Size, empty star
> `opacity/faint`; body cell lines `border/muted` (the master's, was `border/default`); header
> `type-body-sm-700`, footer info `type-caption-300` (the master's raw 12px light). Action Bar
> Global Gap + Button Min Width. Share Item default icon `text/accent` (round-1 sweep) →
> contrast **9/34**. Exempt (reasons in `drift.ts`): Stacked List Default Item Size + Social
> Icon Size (size the caller's trailing button), Data Table cell items not in v1, Header Cell
> Gap, Table Row Gap, Global Min Width / Border Weight (via aliases), mobile footer gap.
>
> **z-index sweep ✅:** page layers on Max's `--z-index-*` — Dialog backdrop + popup `modal`,
> Bottom Sheet backdrop + viewport `drawer`, Toast viewport `toast`; Select / Menu (Dropdown,
> Split Button, Bottom Nav More) / Combobox positioners `dropdown`, Date / Time picker popovers
> `popover`, Tooltip `tooltip` (inline `zIndex` from `useFloatingZIndex`, `utils/layer.ts`).
> **Bug fixed:** Base UI portals popups to `<body>` with no z-index, so a Select opened inside a
> Bottom Sheet (or Dialog) rendered under it (reproduced on the Booking premade); with the bare
> scale it would stay under (dropdown 400 < drawer 800). Overlays now publish their layer via
> `OverlayLayerProvider`; a floating element inside one stacks at that layer + 1 / 2 / 3
> (dropdown / popover / tooltip). Verified: option on top inside the sheet; page Select 400,
> Dialog 900, Toast 1000. Local stacking (`z-10` focus lift, `z-[1]`, `-z-[1]`) stays.
>
> **Motion note — draft, NOT committed (waiting for Max; may be dropped):** `docs/motion-note-for-max.md` — inventory (~35 colour/opacity transitions on
> Tailwind's 150ms default, not `--motion-*`; popups have no motion; Bottom Sheet's own 450ms
> iOS curve), three spring proposals as duration + bounce (`snappy` 250 / 0, `smooth` 400 / 0.1,
> `bouncy` 500 / 0.25) with their computed CSS `linear()` curves, where each applies, and 4
> questions. Code waits for Max's answer (then: map Tailwind's default transition to
> `--motion-duration-fast` / `--motion-easing-default`, add popup enter/exit, move Bottom Sheet).
>
> **Phase 4.7 ✅ closed (2026-11-11)** except the motion note above (on hold until Max answers). **NEXT — 4.8 publishing pipeline** — ask first.
>
> **Per-batch loop:** read the master's bindings (`use_figma`, read-only, file `sX5tik…`) + the
> component's tokens in `packages/tokens/dist/tokens.css` → swap to component vars + `type-*` +
> `capTrim` (`utils/cap-trim.ts`) where a label must trim → spec to `mode: 'component'` in
> `drift.ts` (exempt unused tokens with a reason) → gate: react typecheck + build, `pnpm -F
> @max-core-ds/tokens drift` + `contrast`, `cd apps/storybook && pnpm run build`, biome →
> `docs/audit/scripts/{shots,measure}.mjs` against the static build → PLAN batch note → report,
> wait for the user's go-ahead (commit only when asked).

> **Notes for Max — round 2 (collected during 4.7):**
> - Motion: draft in `docs/motion-note-for-max.md` (uncommitted, on hold — the user may drop it).
> - Data Table cell text: the `_Cell Item / Simple Text` master is Caption/300, but the page's
>   tables mix it with Body/MD/300 (167 vs 64 cells). React keeps Body/MD/300 — which is meant?
>   The footer's "Showing 1–5" text has no text style (raw 12px light).
> - Stacked List Social: `Icon Size` (24) is bound to the trailing button's width (32 on canvas).
> - Switcher Item: with Show Icon off the item hugs to 26 (8 + 10 + 8); React keeps 32 — add a
>   Min Height, or is 26 intended? Hover fill `neutral/subtle` equals the container's `bg/subtle`
>   in dark mode, so dark hover is invisible.
> - Form Group premade: `Size L/Padding` → `- Spacing -/40` and `Size S/M/L/Content Width` →
>   `- Size -/288/392/480` alias variables that are in no collection (deleted?) — recreate or rebind.
> - `radius/focus/3xl` = 24 is smaller than `2xl` = 26 — typo?
> - `glass/elevated` drop shadow colour is raw black 12%, not a token.
> - Button Link, Default tone: Hover / Pressed now stay `text/accent` (status tones still step
>   default → hover → active) — side effect of the `accent/*` → `text/accent` sweep? Code follows Figma.
> - Status ramps in dark mode: `text/on-accent` on dark `status/*/default` — danger 2.90, success
>   2.08, warning 1.91 (needs 4.5). Hits Danger Primary buttons (Button / Icon Only / Split) and the
>   Selected status Tags — the status ramps need the same fix the accent ramp got.
> - Radio Default unchecked **Hover** still binds `accent/hover` (now primary/700 — reads as
>   checked); round-1 rule says `accent/surface`. Code follows the rule.
> - Radio dot `accent/default` on dark `bg/surface` = 2.33:1 (non-text needs 3:1) since dark
>   `accent/default` moved to primary/600.
> - Thumbnail's status dot binds `-- Atoms/Avatar/Size */Status Dot Size` (another component's
>   tokens) — give Thumbnail its own, or a shared Status Dot size set.
> - Time Picker `Selector` rectangle sits at y85, but the centre row is at y67–79 — off-centre?
> - Inputs: Bottom Line S `Input` frame is 44 tall (= M; padding 12 + icon 16 should give 40) and
>   its wrapper 320 wide; S frame gap binds `Size S/Items Gap` and the L wrapper gap `Size L/Inner
>   Gap` (same 8px, swapped names).
> - Stepper S `Input` frame binds `Size S/Number Min Width` (40) as the whole frame's min width.
> - Multiselect `Badge/Min Width` = 240 — the field's min width under a chip name; unused.
> - Stepper number is Caption/700 at every size (12px in a 56px L field) — intended?
**The recipe, applied per component, in tier order (Atoms → Molecules → Organisms):**
1. **Tokens:** replace semantic refs with the component's own vars: `px-[var(--spacing-06)]` → `px-(--buttons-global-size-s-padding)`. The shared utils (`utils/field.ts`, `state-layer.ts`, `tone.ts`, `focus-ring.ts`, `tooltip-surface.ts`) take per-component vars where they size things.
2. **Type:** replace `text-xs font-bold leading-…` with the matching `type-*` utility (cap-trim comes with it; this absorbs the old Phase 5). Re-measure padding-hugged parts against Figma (Tabs, Badge, Segmented, Toast).
3. **Max's changes for that component**, from `docs/figma-answers-round-1.md`. Examples:
   - Tooltip `Position` meaning
   - `Focused` boolean instead of `State=Focused`
   - Toast `Show Dismiss`, Thumbnail `Show Status`, Pagination ellipsis
   - Radio/Switch `Disabled`, FAB hover, Switcher fill/shadow
   - input hover = `border/hover`, placeholder sizes, unchecked tints
   - Tabs 2px underline, Item List shadow, bars on `bg/surface`
   - `overlay/scrim` on Dialog/Bottom Sheet
   - `z-(--z-index-*)` replacing `z-50` / `z-[100]`
   - glass/blur on the bars and FAB
   - `chart/*` as StatsCard's default `chartTheme`
4. **Verify:** typecheck, `drift`, Storybook build, and a Playwright screenshot next to a Figma screenshot of the master.

Batches of about 6 components per commit. The user reviews each batch.

The **"Still open" list** in Max's file stays Figma-side. React matches Figma when it lands (next re-export).

Motion: propose spring values (duration + bounce) for Max to add as `motion/*` tokens, in a short note at the end of Phase 4.7.

---

# Phase 4.8 — Publishing pipeline (Figma → GitHub → registry → projects) — ✅ BUILT (2026-11-16; open: plugin test in Figma, react-forms migration)

> Refined 2026-11-14/15 (planning session). Each step ends with a report and waits for the go-ahead.

**Goal:** Max clicks **Publish to GitHub** in the plugin → a PR with the token diff → CI gates it
(build, typecheck, lint, drift) → merge → release `@max-core-ds/tokens` + `@max-core-ds/react` → projects
upgrade (react-forms first).

**Decisions so far**
- **CI yes, release manual first.** `ci.yml` is the safety net for PRs Max opens from Figma with no
  dev in the loop. Releases start as a local `pnpm release` script; a `release.yml` comes later,
  only when releases get frequent or someone else cuts them.
- **Lockstep versions** (Changesets `fixed`): one version number = one Figma state.
- **Template projects** (rebrand: same components, own Figma copy with other values) need no
  pipeline. They install `@max-core-ds/react`, export their own `tokens.json` (plugin Publish pointed
  at their repo), and generate CSS with `max-core-tokens build` in `predev`/`prebuild`. The build
  fails loudly when their tokens lack a name the installed React version needs (version-skew check).
- **Registry: GitHub Packages, private (decided 2026-11-15).** The GitHub name `max-core` belongs
  to an unrelated user, so the org is **`max-core-ds`** and the scope became **`@max-core-ds/*`**
  (renamed repo-wide). Free plan quotas (500 MB storage, 1 GB/month transfer outside Actions)
  are far above our ~0.4 MB per release. Consumers need a classic `read:packages` PAT.
- **Versions:** first release **0.1.0** (`^0.0.x` ranges never pick up updates). Token value
  changes / fixes = patch, API or token renames = minor, 1.0.0 when the API is declared stable.
  The plugin carries the same number in its UI and release zip; apps + scripts stay 0.0.0.
- **Open:** plugin distribution to other teams (Figma private org plugin vs a zip per release).

## 4.8.0 Prerequisites
- [x] Lint baseline cleared (95 → 0): `figma-node-links/` data ignored, `noNonNullAssertion` off
  (redundant with `noUncheckedIndexedAccess`), CSS single quotes, `@source` moved below the
  `@import`s in both apps, safe formatting fixes. Build, typecheck, drift green.
- [x] Org `max-core-ds` created, repo transferred, `origin` = `git@github.com:max-core-ds/max-core.git`.
- [ ] Max invited (Write) · org Actions + fine-grained PAT settings · Max's PAT (Contents + PRs RW
  on the one repo) · branch protection on `main` requiring `ci` (after 4.8.3).

## 4.8.1 Make the packages publishable — ✅ done (2026-11-15)
> Done: both packages 0.1.0 with `repository` + `publishConfig`; react ships `dist/styles.css`
> (`@source './'`), peer `@max-core-ds/tokens ^0.1.0`; tokens built by tsup (`dist/cli.js` bin,
> `types.d.ts`, `tokens.json`, **`contract.json`** = the 649 vars react reads, from new
> `src/contract.ts`, also reused by drift). Apps use the consumer CSS block; Storybook CSS came
> out byte-identical. Verified with the packed tarballs in a scratch Vite + Tailwind v4 app
> (light + dark render) and the CLI: full tokens → OK, missing vars → exit 1 with the names.
- `@max-core-ds/react` 0.1.0: `dist/styles.css` (`@source "./";`, copied in tsup `onSuccess`),
  `exports["./styles.css"]`, `sideEffects` for CSS, `repository`, `@max-core-ds/tokens` as peer.
- `@max-core-ds/tokens` 0.1.0: `tokens.json` + `types.d.ts` shipped from `dist/`, fix `./types`,
  compiled `bin: max-core-tokens` → `build [--input] [--out]` + the token-contract check against
  the installed `@max-core-ds/react` (React ships the list of token vars it uses).
- Consumer CSS (both apps dogfood it): `tailwindcss` → `@max-core-ds/react/styles.css` →
  `@max-core-ds/tokens/tokens.css` → `theme.css`. The workspace `@source` into `packages/react/src` goes.

## 4.8.2 Changesets — ✅ done (2026-11-15)
> Done: `@changesets/cli` v3, `.changeset/config.json` (`fixed` lockstep, restricted access,
> private apps/plugin not versioned, built-in changelog — `changelog-github` needs a GitHub token
> even locally, so it comes back with `release.yml`). Package versions back to 0.0.0: the seeded
> `minor` changeset (`.changeset/first-release.md`) makes them 0.1.0 at release (trial run on a
> scratch copy: both 0.1.0 + CHANGELOGs). Apps renamed `@max-core-ds/storybook|showcase` (the
> app named `storybook` clashed with the `storybook` npm dep in Changesets). `pnpm changeset` to add one.
- `@changesets/cli` + `changelog-github`, `fixed: [["@max-core-ds/tokens","@max-core-ds/react"]]`,
  apps + plugin ignored. Seed changeset for 0.1.0. Changeset entries name added/renamed tokens.

## 4.8.3 CI — `.github/workflows/ci.yml` — ✅ built (2026-11-15), live test pending a push
> Done: job **`ci`** (required check): install (frozen) → build → typecheck → lint → drift;
> contrast reports to the job summary + a warning, never blocks. Job `token diff` (PRs): sticky
> comment (`gh pr comment --edit-last --create-if-none`) when `tokens.json` changed, and a warning
> when `packages/{react,tokens}/src` change without a changeset. New pure `src/diff.ts`
> (`diffTokens`, text + markdown, suggested bump; bundled into the plugin in 4.8.5), `sync` uses
> it, new `pnpm -F @max-core-ds/tokens diff --base <file>`. actionlint clean; CI steps rehearsed
> in a clean copy (no node_modules/dist/cache): all green. Bin is a committed stub
> (`bin/max-core-tokens.js` → `dist/cli.js`) so clean installs link it without warnings.
- build → typecheck → lint → drift (blocking) → contrast (reported, job summary).
- New `packages/tokens/src/diff.ts` (extracted from `sync.ts`), sticky PR comment with the token
  diff on PRs touching `tokens.json`. Warn when `packages/*/src` changes with no changeset.

## 4.8.4 Release (manual first) — ✅ done: **v0.1.0 published 2026-11-15** (`7404953`, both packages private, linked to the repo)
> `pnpm release` (`scripts/release.mjs`): preflight (main, clean, in sync with origin, pending
> changesets, `GITHUB_PACKAGES_TOKEN` set) → `changeset version` → same gate as CI → commit
> `chore(release): vX` → `changeset publish` with a temporary npmrc (token never in the repo) →
> annotated tag `vX`. `--publish-only` retries a failed publish. Push stays manual
> (`git push --follow-tags origin main`, admin bypass on the ruleset). The GitHub Release with
> tgz files moves to the later `release.yml` (it needs a repo-scoped token; the registry already
> holds the tarballs). Repo went **public** (2026-11-15) so the free plan enforces the `main`
> ruleset; fork PRs skip the diff comment (read-only token).
- Root `pnpm release` = `changeset version` → build → `changeset publish` → tags → `gh release`
  with the `.tgz` files (+ the plugin zip). `release.yml` later.

## 4.8.5 Plugin "Publish to GitHub" — ✅ built (2026-11-15), live test in Figma pending
> Done: UI logic moved to `src/ui.ts` (bundled + inlined into `dist/ui.html`, version from the
> tokens package → "v0.1.0" in the header); GitHub client `src/github.ts` (fetch only):
> preview = ref + `contents` at the base commit → `diffTokens` ("Already up to date" when
> empty); publish = branch `figma/tokens-<yyyymmdd-hhmm>` (suffix on 422) → PUT tokens.json
> (sync formatting) → `.changeset/figma-tokens-<stamp>.md` (minor if tokens removed, else patch;
> names added/removed tokens) → PR with the markdown diff → "View pull request". Settings in
> `figma.clientStorage` (owner/repo/base/path/token/changeset), Max Core defaults. Manifest:
> `api.github.com`. Separate `tsconfig.ui.json` (DOM). Tested with a fake GitHub API under Node
> (15 checks incl. 401/403/404 messages) + UI screenshots.
- `allowedDomains: ["https://api.github.com"]`; settings (owner/repo/base/PAT) in
  `figma.clientStorage`, so template projects point it at their own repo.
- GET tokens.json → diff (bundled `diff.ts`) → branch → PUT tokens.json → PUT `.changeset` file
  (Max Core repo only) → open PR → show link. Download stays as fallback.

## 4.8.6 Docs + consumers — ✅ docs done (2026-11-16); react-forms migration waits for the user
> Done: README rewritten where stale (intro, tokens + plugin sections, **Release workflow**
> A–D + fallback + conventions/tokens, status, commands, structure, doc links);
> `docs/consuming.md` (access, classic `read:packages` token, `.npmrc`, CSS block, dark mode,
> Inter, version policy, Dependabot with a grouped `@max-core-ds/*` + registry secret,
> troubleshooting); `docs/template-usage.md` (Figma copy rules, plugin settings for another
> repo, `tokens` script chained into dev/build — not `pre*` scripts, which depend on the package
> manager — contract check). PROGRESS + memory updated.
- **README "Release workflow" section** (user request, 2026-11-15; write it after 4.8.5 so it
  describes the real plugin flow). Steps, recapped in the 4.8 planning session:
  - **A. Max changes tokens:** edit Figma (`Max core` mode) → plugin **Publish to GitHub**
    (diff vs `main`, branch `figma/tokens-<date>`, `tokens.json` + changeset, PR link) → CI
    (`ci` check incl. drift, token diff comment, contrast report) → user reviews; green = merge,
    red = Max re-publishes or user fixes react on the branch.
  - **B. User changes code:** change → `pnpm changeset` (patch/minor) → push or PR, merge on green.
  - **C. Release (user, local, whenever):** `git pull` → `read -rs GITHUB_PACKAGES_TOKEN &&
    export GITHUB_PACKAGES_TOKEN` → `pnpm release` → `git push --follow-tags origin main`.
    Pending changesets batch into one version.
  - **D. Projects pick it up:** Dependabot PR or `pnpm update`; template projects' build check
    names new tokens to add to their Figma copy.
  - Fallback without the plugin button: Export → `sync --input` → `pnpm changeset` → PR.
  - Conventions: only the user merges; packages token (classic, `write:packages`) vs Max's
    plugin token (fine-grained, repo-scoped) — which is used where.
- `docs/consuming.md` (`.npmrc`, `read:packages` token, CSS block, dark mode, `dependabot.yml`),
  `docs/template-usage.md` (rebrand setup, `predev`/`prebuild`, contract check). README status,
  PROGRESS, memory. (`docs/publishing.md` folds into the README section above.)
- **react-forms migration: ask first.**

---
## Critical files
- **Plugin:** `packages/figma-plugin/src/transform.ts` (`figmaNameToTokenPath`, `buildComponents`, `buildEffects`, new `buildTypography`), `code.ts`, `ui.html`
- **Tokens:** `packages/tokens/src/types.ts`, `transform.ts` (`generateTokensCss`, new `generateThemeCss`), `cli.ts`, `sync.ts` (`validateShape`), `drift.ts`, `conformance.ts`, `contrast-audit.ts`, `package.json` (exports for `theme.css` and types)
- **Apps:** `apps/storybook/src/global.css` and `apps/showcase/src/styles.css` (import `theme.css`; drop the hard-coded Inter)
- **Phase 4.7:** `packages/react/src/components/**`, `packages/react/src/utils/*`

## Verification (Phase 4.6)
- **Before the re-export:**
  - Run the new generator on the *current* `tokens.json`. The existing vars must come out byte-identical, so new output is additive only: diff old vs new `tokens.css`, ignoring the new sections.
  - `tsc` on the plugin and the tokens package.
- **After the re-export:**
  - `sync --dry-run` lists the expected changes: Max's colour ramp, new tokens, the 11 plain numbers that became aliases.
  - `build` reports no name collisions.
  - `drift` passes in legacy mode.
  - `contrast` findings drop.
  - Storybook builds. Playwright spot-check of Button, Input and Tabs in light and dark (only colour changes expected).
- **`theme.css`:** a Storybook scratch story renders all 15 `type-*` utilities next to the Figma text-style specimen screenshot. Cap-trimmed heights match Figma (Tooltip: 41px).

---

# Phase 5 — Cap-trim sweep — ➡️ FOLDED INTO PHASE 4.7 (2026-11-09)

> Max (round-1 answers, Q2) decided the mechanism: CSS `text-box: trim-both cap alphabetic`
> with the untrimmed fallback. It ships inside the generated `type-*` utilities (Phase 4.6.4)
> and each component adopts it in its Phase 4.7 pass. The gap list below is the re-measure list.


> **Why:** every Figma text style has `leadingTrim: CAP_HEIGHT`, so a label's Figma box is its
> cap height (Caption ~9, Body/SM ~10) and padding runs from the cap top to the baseline. React
> renders full line boxes (and Tailwind `text-sm` is a 20px line vs Figma's 18.2), so every
> padding-hugged component is ~7–8px taller than its master. Fixed-height parts (buttons,
> inputs) are fine. Decided 2026-10-24 as one focused pass; it comes before Phase 6 so tests
> never lock in the old heights.

## Step 1 — Pick the mechanism — ✅ decided: CSS trim (Max, Q2)
- **CSS trim** — `[text-box:trim-both_cap_alphabetic]`, as the tooltip surface already does
  (`utils/tooltip-surface.ts`, commit `36fa09e`). Exact in Chrome/Edge 133+ and Safari 18.2+;
  other browsers fall back to today's taller rendering.
- **Padding compensation** — subtract the trimmed half-leading from the padding. Works
  everywhere, less exact, and couples padding to line height.

## Step 2 — Apply + re-measure against each master
Measured gaps (React vs Figma) from the Phase 4.5 audits: Tabs 45 vs 34 · Badge ~28/32/36 vs
21/25/29 · Segmented item ~34 vs 26 · Entity Item 48 vs 32 (with subtitle) · Stacked List rows
70/80/104 vs 56/80/80 · Top Bar floating 132 vs 118 · Stats card compact 239/198 vs 220/180 ·
Bottom Sheet header 26 vs 24. Also: Switcher, Tag, Time picker rows, Progress Bar / Range
labels, Date picker weekday row, Input placeholders.
- **Toast:** title/body have no gap today because the untrimmed line boxes supply the
  master's 10px; trimming them needs a 10px gap back.
- **Done already:** Tooltip + Range bubble (40.8 vs 41).

## Verification
Each component re-measured against its master's real frame height (not the token sum), the
verify gate green, Storybook screenshots matching Figma in light and dark. Note the outcome on
each `docs/audit/<slug>.md` page and close the carry-over in `PROGRESS.md`.

---

# Phase 6 — Test infrastructure — ⏳ NOT STARTED (planned 2026-11-17)

> Formerly Phase 4 Batch 13 — the honest gap from Phase 3. Today's gates (CI `ci` check):
> build, typecheck, lint, drift; contrast is report-only. **Nothing checks that a component
> renders or behaves.** Each step ends with a report and waits for the go-ahead.

**Goal.** Every story is rendered and axe-scanned in a real browser; every component with
logic has behaviour tests; both run in the required `ci` check, so a regression blocks the
merge. Known a11y issues are **declared, not hidden** — CI is green from day one and the
exception list only shrinks.

**Two layers (decided 2026-11-17):**

| Layer | Tool | Where | Covers |
|---|---|---|---|
| Story tests | Storybook 10 `@storybook/addon-vitest` + `@storybook/addon-a11y`, Vitest browser mode (Playwright, Chromium) | `apps/storybook` | every story renders without errors + axe scan; `play` functions only where a story already shows an interaction |
| Behaviour tests | Vitest + React Testing Library + `@testing-library/user-event` (jsdom) | `packages/react/src/components/<Name>/<Name>.test.tsx` | logic: state, events, keyboard, ARIA, controlled/uncontrolled, edge cases |

Story tests run against the **built** `@max-core-ds/react` (as Storybook does — run
`pnpm build` first; CI already does). Behaviour tests import the source.

## 6.1 Infrastructure — ✅ done (2026-11-17)

> Done: Storybook 10.4.1 → **10.6.7** (addon-vitest needs ≥10.4.6; Vitest 5 support from 10.6)
> + `addon-a11y` + `addon-vitest`, **Vitest 5.1** in both packages, Playwright Chromium.
> `apps/storybook/vitest.config.ts` (merges `vite.config.ts`; preview annotations are applied
> by the plugin — no setup file). `preview.tsx`: `a11y.test: 'error'`, `color-contrast` off.
> `packages/react/vitest.config.ts` + `src/test/setup.ts` (jest-dom, cleanup, `matchMedia` /
> `ResizeObserver` stubs). **jsdom pinned to 29** — 30+ needs Node ≥22.22 (local is 22.14).
> Samples: `Pagination.test.tsx` (4 tests incl. the constant-window regression) ✅; Pagination
> stories ✅; a throwaway unnamed-button story failed on `button-name` → axe is live.
> Storybook build, typecheck, lint green. Full story run = 6.2.

- Add `@storybook/addon-vitest` + `@storybook/addon-a11y` (`npx storybook add …`), Vitest
  browser mode + Playwright Chromium; `test` script in `apps/storybook`.
- Vitest + RTL + user-event + jsdom in `packages/react`; `test` script; shared setup
  (`@testing-library/jest-dom` matchers, `matchMedia` / `ResizeObserver` stubs for Base UI).
- Turbo `test` task already exists (`dependsOn: ["^build"]`, root `pnpm test` calls it) —
  only the per-package `test` scripts are missing.
- One sample test per layer to prove the wiring. **Report.**

## 6.2 Story smoke + axe — first run, triage — ✅ done (2026-11-17)

> First run: 150 / 173 passed; 23 failures in 9 components, 7 issues — **all fixed in code,
> no exceptions needed** (user: fix all; ScrollArea option (a)). SideBar collapsed rail buttons
> unnamed (ListItem / EntityItem now keep the label `sr-only`); Range thumbs unlabellable (new
> `aria-label` / `aria-labelledby` / `getAriaLabel` on the thumb inputs); DateInput +
> TimePicker trigger `aria-label` hid the visible value (now `aria-labelledby` label + value);
> DatePicker day names "1, Tuesday, September 2026" + `day="[object Object]"` leak fixed;
> SegmentedControl / Switcher `aria-orientation` on `role="group"` (Base UI) overridden;
> ScrollArea viewport becomes a Tab stop when it overflows with nothing focusable inside;
> Switch + native-scrollbar stories labelled. **173 / 173 pass.** Patch changeset
> `a11y-story-audit-fixes`. 6.3's exception list starts empty.

- Run all stories (~55 components + Foundations: Tokens, Effects, FocusRing).
- Defaults: `a11y.test: 'error'`; **`color-contrast` off globally** — colours are Figma-owned
  and already tracked by `pnpm -F @max-core-ds/tokens contrast` (no double reporting).
- Triage every violation into: **fix now** (small code fix, done in this step) / **Figma**
  (→ "Notes for Max") / **accepted by decision** / **fix later**. Report the list and wait
  for decisions before marking anything.

## 6.3 Known exceptions — ✅ done (2026-11-17)

> Done: `docs/a11y-exceptions.md` (table + owner types + "How to add one"); one row,
> **A11Y-000** = the global `color-contrast` off (policy), now tagged in `preview.tsx`. Guard
> `apps/storybook/scripts/check-a11y-exceptions.mjs` (`pnpm -F @max-core-ds/storybook
> a11y:exceptions`) scans stories, `.storybook/` and `packages/react/src`: markers are
> `test: 'todo'|'off'`, `enabled: false`, `.fails` / `.skip`; tag = `A11Y-EXCEPTION: A11Y-NNN`
> on the line or ≤3 above (closest wins); `.only` always fails; stale doc rows fail. Probed
> all failure modes with throwaway files (6 caught). `it.todo` needs no tag. CI wiring = 6.5.

- **`docs/a11y-exceptions.md`** — one row per exception: component/story, axe rule, reason,
  owner (code / Figma-Max / accepted), date. Same idea as the contrast "declared" findings.
- How an exception is marked, most precise first:
  1. **Scoped rule off** — `parameters.a11y.config.rules: [{ id, selector, enabled: false }]`
     (one rule, one element; the rest of the story still checked);
  2. **Story `todo`** — `parameters.a11y.test: 'todo'` (warning in the a11y panel, test passes);
  3. `'off'` — only for non-UI stories (e.g. token swatches), never for a component.
  Every marker carries a `// A11Y-EXCEPTION: <id>` comment matching the doc row.
- Behaviour tests: `it.fails` for a known bug (turns red once fixed → remove the exception),
  `it.todo` for unwritten cases. No silent `it.skip`.
- **Guard script** (`apps/storybook/scripts/check-a11y-exceptions.mjs`, runs in CI): every
  `todo` / disabled rule / `it.fails` in the code has a row in the doc and vice versa, so an
  exception can't be added or left behind silently.

## 6.4 Behaviour tests — in batches (report after each)

Only components with logic; display-only components (Avatar, Badge, Divider, Spinner,
Thumbnail, StatusDot, ProgressBar, Pin, ContentBlocks, Card, StackedList, StatsCard, …) stay
on the story smoke + axe layer.

- **B1 Controls + buttons:** Button, IconOnlyButton, LinkButton, SplitButton, Fab (speed-dial
  names), Checkbox, Radio, Switch, SegmentedControl (no deselect), Tag (filter chip
  `aria-pressed`), Switcher — click/keyboard toggles, disabled blocks events, `onChange`
  values, controlled vs uncontrolled.
  > ✅ **B1 done (2026-11-17):** 11 test files, 49 tests (+ Pagination's 4 → 53). Found + fixed
  > (patch changeset `selection-controls-a11y`): Checkbox / Radio / Switch names included the
  > helper / error text (the `<label>` wraps it) → now `aria-labelledby` the label text; no
  > `aria-invalid` on error → added; RadioGroup helper / error not linked → `aria-describedby`
  > + group `aria-invalid`. Covered: form submit (type=button default), Enter / Space,
  > disabled, refs, SplitButton menu (open, pick, disabled item, Escape → focus back), Fab
  > speed dial (names, toggle, Escape, outside), controlled vs uncontrolled, indeterminate =
  > mixed, radio arrow keys skip disabled, Segmented / Switcher no deselect, Tag button /
  > toggle. Story tests still 173 / 173.
- **B2 Fields:** Input, BottomLineInput, Textarea, Stepper, SearchBar (clear ✕), SelectInput,
  Multiselect (typeahead + `mode="list"`, Select all) — label association, `errorMessage` →
  error text + `aria-invalid`, disabled, value shown (not raw value), keyboard pick.
  > ✅ **B2 done (2026-11-17):** 7 test files, 47 tests (100 in `packages/react`). Shared
  > `src/test/text-field-contract.tsx` (label-only name, aria-label, helper / error + invalid,
  > typing, controlled, disabled, form `name`) for Input / BottomLineInput / Textarea — all
  > clean (Base UI Field). Found + fixed (patch changeset `fields-a11y`): Multiselect
  > typeahead `aria-label` landed on the chips wrapper, not the input; ItemList "Select all"
  > checkbox took the surrounding field's label as its name; SearchBar clear lost focus to
  > `<body>`. Covered too: Stepper buttons / arrows / min-max / disabled; SelectInput click +
  > keyboard pick, label not raw value (regression), Escape, controlled; Multiselect filter,
  > chips, remove, list mode toggle + filtered Select all. **`name` added** to SelectInput /
  > Multiselect (user, 2026-11-17): hidden input(s) mirror the value, controlled or not;
  > JSDoc caveats = native reset doesn't reset a controlled value; with a form library leave
  > `name` out (double submit). Tests submit real forms (103 in `packages/react`).
- **B3 Navigation + overlays:** Tabs, Pagination (constant-length window, no duplicate pages),
  Dropdown (`open`/`onOpenChange`), Tooltip, Dialog, BottomSheet, Toast, SideBar (collapse via
  `SideBarTrigger`), BottomNavigation (`menu`) — open/close, Escape, focus return, active item.
  > ✅ **B3 done (2026-11-17):** 8 test files, 36 tests (139 in `packages/react`; Pagination
  > kept its 4 from 6.1). One fix (patch changeset `bottom-nav-dot-label`): the BottomNav
  > notification dot was visual only → sr-only ", New activity" + item `dotLabel`. Checked and
  > **not** bugs (Base UI by design, tests document them): Tabs keep disabled tabs focusable
  > but not selectable (ARIA tabs pattern); the Toast ✕ is `aria-hidden` until the stack
  > expands or it takes focus (keeps "Close" out of the live read-out); a pointer click on a
  > controlled-closed Dropdown doesn't call `onOpenChange` in jsdom only (verified in
  > Chromium that it does) → that test opens with Enter. Covered: Dialog / BottomSheet names,
  > description, focus in + back to trigger, Escape, ✕, controlled; Dropdown pick / disabled /
  > Escape / defaultOpen; Tooltip hover + focus + Escape; Toast live region, action, dismiss;
  > SideBar toggle + collapsed names (6.2 regression) + controlled; BottomNav current, More
  > menu, disabled, hidden label.
- **B4 Pickers + ranges:** DatePicker (ISO-string API, range, today), DateInput, TimePicker,
  Range, Knob, ScrollArea (`data-overflow-*`) — value in/out, keyboard steps, min/max.
- Shared hooks: `useControllableState` unit tests.

## 6.5 CI

- Add `pnpm test` to the required `ci` job after build (Playwright Chromium install, cached),
  plus the exception guard script.
- Failing test or axe violation (not declared) → red PR. Contrast stays report-only.
- Update README (Status, Commands), `docs/audit/README.md` (add the test step to the
  per-component recipe) and PROGRESS.

**Out of scope:** visual regression / screenshot diffs (Chromatic etc.), coverage targets,
cross-browser runs, tests for the Figma plugin and the tokens CLI (separate follow-up if
wanted).

---

# On-demand backlog

Left out of the Phase 4 lean v1s by design; build when a real project needs them.

- **Stacked List** — ride / delivery / booking / items-grid / transport row types (5 of 9).
- **Data Table** — mobile scroll variant + "Load more"; `_Table Row Expanded`; the stats/tabs
  Table Header content (callers compose it into `header` today); the 5 prebuilders (Invoice,
  Users, Tickets, Products, Transactions).
- **Bottom Sheet** — 5 of the 18 premades: Transport / Map, Ride ×2 and Booking / Place List
  wait on their Stacked List rows; Sort duplicates Settings in the master.
- **Date Picker** — Figma's month/year scroll wheels (grids today, by decision).
