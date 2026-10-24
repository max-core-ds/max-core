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

## Phase 1 deliverables (foundation — this plan) — ✅ DONE

> **Status:** Shipped. Token pipeline + 5 atoms (Avatar, Badge, Button, Input, Tag) + Storybook (incl. Tokens reference story) all in place. Automated tests (Vitest + axe) were deferred to a later phase by decision — not delivered here.

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

# Phase 2 — Token sync (plugin + CLI) — ✅ DONE

> **Status:** Shipped. `packages/figma-plugin` (export) + `packages/tokens/src/sync.ts` (ingest) + extracted `types.ts` all in place. Scope note: the Components collection (414 tokens) and shadow Effect Styles (12) are now **exported** into `tokens.json` — going beyond the "skip Components" deferral written below — but they are **not yet consumed by CSS** (see Deferred decision D1).

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

# Phase 3 — React component buildout (~40 components)

> **Status (2026-07-13):** Batch 0 (foundation + drift gate) and Batches 1–7 shipped —
> 46 components, drift-green, in tiered Storybook folders (Atoms/Molecules/Organisms ×
> functional themes). **Remaining:** Batch 8 (Stacked List) + the visual cross-check
> pass, now underway (see **Phase 3.5** below and `PROGRESS.md` for live status).

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

# Phase 3.5 — Visual cross-check against Figma showcases — ✅ EXPORTED QUEUE DONE

> **Why:** components were built from the exported `tokens.json` `components` block,
> which only carries **dimensions** (spacing/size/radius). It does **not** carry states,
> colors, per-variant fills, or whole axes. So a component can be drift-green yet still be
> visually wrong or missing a variant. This pass reconciles each component against its
> Figma showcase. Live status: **`PROGRESS.md`**.
>
> **Status:** every `figma-node-links/*.json` the designer has provided (12 files) is
> cross-checked and moved to `figma-node-links/checked/`. The pass resumes when new files
> are dropped in. Components without a node-link file are **not yet visually verified**
> (built from tokens only).

## Input: `figma-node-links/*.json`
The designer exports one JSON per component group — the showcase node tree, including the
component set's **variant names** (`Size=…, Variant=…, Tone=…`) and, crucially, **description
text nodes** that spell out states/structure/tokens the variables omit. **The showcase nodes
live in the PRODUCTION file `ouyi08XxN4l4VCsao1nNQu`** — the cross-check file
`sX5tikviuBEhNbu2iPVya5` only holds a subset of pages, so when a node ID isn't found there,
fall back to the production key (verify with `get_metadata` with no nodeId to list pages).
Node IDs use colons (`51:656`); Figma URLs use dashes (`node-id=51-656`).

## Process (one file at a time, in the order the designer provides)
1. **Summarize the JSON** — extract variant names + description nodes (helper script:
   `node figma-node-links/summarize.js figma-node-links/<file>.json` — walks the tree, prints top frames, long
   description strings, and every `X=Y` variant). This reveals the true axes/states.
2. **Compare to the React impl** — does it have every axis (variant/tone/size/state), the
   right defaults, correct structure? List gaps.
3. **Confirm intent from Figma** — `get_screenshot` (curl the returned URL → PNG → Read) and
   `get_variable_defs` on the component-set node and a few representative variant nodes.
   Descriptions lie less than screenshots; read both. For exact fills use `get_design_context`
   (the generated Tailwind names the bound token, e.g. `bg-[var(--bg/surface)]`).
   **Token names are mode-independent; the hex you see depends on which mode the file is in —
   map by token name, not hex.**
4. **Fix** — put shared color literals in `packages/react/src/utils/*` (Tailwind can't see
   interpolated classes); keep every class a full literal. Match Figma variant **names** where
   reasonable (e.g. Tag `filled`→`primary`).
5. **Verify** — the standard gate (typecheck · build · Storybook tsc · `drift` · biome).
   Rebuild `@max-core/react` before the Storybook tsc + drift — both read the built `dist`.
6. **Update the story** — expose any new axis; add an `AllVariants`/matrix story.
7. **Commit** (one per file; message names the Figma finding) and **`git mv` the file into
   `figma-node-links/checked/`**, then tick it in `PROGRESS.md`.

## Findings (all were drift-green yet still wrong)

First batch (5 files):
- **Badge** collapsed a whole axis (no Default/Outline/Ghost). Later also: Default tone recolored to the subtle pattern (accent border + text).
- **PayButton** conflated Color with Provider (hardcoded black/white instead of theme-aware token pairs). *(Component later removed from the library.)*
- **Tag** treated the Selected state as a focus ring; the "filled" look was actually Selected.
- **LinkButton** was bold with no Pressed state (Figma: Light label, 4 states).
- **Checkbox/Radio/Switch** were missing the entire Validation axis + helper text.

Second batch (7 files):
- **SegmentedControl** active item was an iOS-style white surface pill; Figma is an `accent/default` fill (no shadow).
- **ListItem** had a grey `bg/subtle` hover and no Pressed/Active/Collapsed; Figma uses accent state fills (subtle/active/default) + Active + Collapsed axes.
- **SearchBar** was missing the Button=On mode (trailing Standard Button) and filled `bg/surface` instead of `bg/default`.
- **Dialog** was a plain left-aligned modal; Figma is a confirmation dialog with Tone (danger/success/warning) icon + Type (horizontal/vertical) layouts + Show Icon.
- **TopBar** lacked the Elevated axis and the mobile Type (Standard vs floating Mobile with frosted-glass buttons).
- **BottomNavigation** only recolored the active label; the `_Nav Item` has 5 accent state fills + a Dot indicator + disabled (and is mobile-only → no focus ring).
- **SideBar** had 3 slots; Figma is a 5-slot wrapper (added Top Bar + Sub Header).

Two of the second batch also revealed **the description text can disagree with the bound token** (ListItem Padding Y, SearchBar tokens) — trust `get_variable_defs` on the master over the prose.

**Lesson:** the recurring failure is *missing axes/states*, not wrong numbers — the drift gate
guarantees dimensions, never appearance. Treat description nodes as the spec of record, but
confirm exact values against the master's bound variables.

---

# Phase 4 — Mega-systems + test infra — 🔄 IN PROGRESS

> The large composite systems deferred out of Phase 3, plus the first automated
> test layer beyond the drift gate. Component specs already exist on the Figma
> side in **`docs/MAX-CORE-SUMMARY.md`** (Data Table System, Card System, Bottom
> Sheet System) — this phase builds their React counterparts. Live status is
> tracked in **`PROGRESS.md`** as batches land.
>
> **Status (2026-10-23):** Batches **8 (Stacked List)** and **9 (Data Table)**
> shipped as **lean v1s** and visually cross-checked against the Figma masters;
> **12 (Date Picker)** landed 2026-09-17 — see the per-batch notes below and
> `PROGRESS.md`. Batches **10 (Card)**, **11 (Bottom Sheet)** and **13 (test infra)**
> not started — next is Card. Also landed: the **contrast guardrail** (`pnpm -F @max-core/tokens
> contrast`, WCAG AA text/bg pairings, light+dark) which pre-empts part of Batch 13's
> a11y goal.

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

### Batch 10 — Card system
- **`_Card` (Base)** — 3 elevations (None/Low/High), Show Header/Footer booleans,
  Body slot. Tokens `--Organism/Card/Base/*`.
- **`_Media Card`** — 3 elevations, Show Tag/Date booleans, Media + Content slots,
  right-aligned link button. Tokens `--Organism/Card/Media/*`.

### Batch 11 — Bottom Sheet system
- **`_Bottom Sheet` (Builder)** — 375px, Show Handle/Header/Footer booleans, Body
  + Footer slots (body has no padding; sub-components own their padding). Shadow
  up/md, radius 2xl top-only.
- **18 premades** — Share (3), Transport, Ride (2), General (3), Payment (2),
  Media, Auth, Commerce (2), Info, Booking (2). Each composes DS components into
  the builder's slots.

### Batch 12 — Date Picker — ✅ landed (2026-09-17, commit `d17a0b7`)
React counterpart of the Figma Date Picker (Calendar + Header + Footer; Date /
Dual / Input variants). Shipped `DatePicker` / `DualDatePicker` / `DateInput` on
**`react-day-picker@9`** restyled onto tokens via `classNames`/`components` (no CSS
import, kept `external`); ISO-string public API via a `date.ts` `Date↔ISO` adapter;
custom `MonthCaption` header with month/year **drill-down**; drift-green. Day picker
cross-checked against the Figma master; **month/year render as grids — Figma
scroll-wheels deferred** by decision. See PROGRESS.md + memory
`project-datepicker-react-build`.

### Batch 13 — Test infrastructure
The honest gap from Phase 3. Add:
- **Vitest** + React Testing Library — render/interaction tests per component.
- **axe** (jest-axe / vitest-axe) — automated a11y assertions on every story.
- Wire into CI once CI exists (also currently missing — see README "Status").

## Sequencing

Stacked List ✅ → Data Table ✅ (both lean v1) → Date Picker ✅ (Batch 12) →
**next: Card** → Bottom Sheet (needs Card + many atoms as slot content). Test infra (Batch 13)
can start in parallel — the contrast guardrail already covers part of the a11y
goal. Return to the deferred Stacked List row types / Data Table mobile+expandable
+ prebuilders when the real project needs them.

## Out of scope for Phase 4
Layer 3 component-level token bridge (the `components` collection is still read
for drift but not yet re-wirable per slot); publishing to npm; CI/CD; Figma
plugin Community listing. These are productionization concerns tracked in the
README "Status" gaps, not component work.

---

# Phase 4.5 — Component audit: Figma doc page ↔ React — ⏳ NEXT (before Batch 10)

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
| 8 | **A11y** | Semantic element / role / aria, keyboard interaction, contrast (`pnpm -F @max-core/tokens contrast`). |
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
