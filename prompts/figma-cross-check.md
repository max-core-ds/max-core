# Prompt — Continue the Figma visual cross-check

> **How to use:** paste the block below to start a new conversation that continues the
> Phase 3.5 visual cross-check of `@max-core/react` against the Figma showcases. It also
> reads as a reference for the process. To build a *new* component instead, use
> [`implement-component.md`](./implement-component.md).

---

```
I'm continuing the Max Core design-system work: cross-checking the React component
library (packages/react) against the authoritative Figma masters and fixing whatever
the raw tokens didn't capture (missing states, colors, whole variant axes, wrong tier).

READ FIRST (in this order):
- PROGRESS.md          — live status: every shipped component, its Storybook title, and
                         its cross-check status. Source of truth for done vs. pending.
- PLAN.md → "Phase 3.5 — Visual cross-check against Figma" — the process, step by step,
                         plus findings/lessons so far.
- figma-node-links/INDEX.md — the component → tier → node-id → link map, generated from
                         the full Figma tree. This is the always-readable map; never
                         open the multi-MB pages/*.json directly.
- CLAUDE.md + docs/MAX-CORE-SUMMARY.md — design-system rules and token conventions.

THE INPUT:
figma-node-links/INDEX.md lists every COMPONENT / COMPONENT_SET master grouped under its
Figma tier (## Foundations / ## Atoms / ## Molecules / ## Organisms — these headers are
authoritative for our Storybook tier), each with its node id + an open link. For a single
subtree without loading a whole page: `node figma-node-links/query-tree.mjs "<name|id>" [depth]`
(depth ~3 default) — this also surfaces the designer's per-page docs (Token Architecture /
How to Customize / Live Examples) carried as TEXT nodes, no MCP needed.
Figma file key: sX5tikviuBEhNbu2iPVya5 (pt-razvan-max-core) — the tree was exported from
this file, so INDEX.md node IDs resolve ONLY here. Point every MCP call at this key.
(ouyi08XxN4l4VCsao1nNQu is the older production file; its node IDs differ — don't use it
for tree lookups.) Node IDs use colons (51:656); Figma URLs use dashes (node-id=51-656).

THE LOOP (one component at a time, in the order I give you — don't jump ahead):
1. Look up the component's master in INDEX.md → node id + tier. Optionally
   `node figma-node-links/query-tree.mjs "<node id>" 3` for its structure + spec text.
2. TIER CHECK: the ## section the master sits under in INDEX.md is the source of truth for
   the Storybook `title:` prefix. If the story's tier prefix disagrees, fix the title
   (tier prefix only; flat <Tier>/<Component> convention and the React source dir stay put)
   and relocate its row in the PROGRESS.md inventory table.
3. Read the matching React component(s) and list gaps vs. the Figma master.
4. Confirm intent with the Figma MCP on file sX5tikviuBEhNbu2iPVya5:
   get_screenshot(nodeId) (curl the URL → PNG → Read), get_variable_defs(nodeId), and
   get_design_context(nodeId) for exact bound tokens. Map by TOKEN NAME, not hex (hex
   depends on the file's light/dark mode).
5. Fix — shared color literals go in packages/react/src/utils/* (Tailwind can't see
   interpolated classes; every class must be a full literal). Match Figma variant names.
6. Verify (the gate below). Rebuild @max-core/react before the Storybook tsc + drift —
   both read the built dist.
7. Update the story to expose any new axis (add an AllVariants/matrix story).
8. One commit per component (message names the Figma finding); update PROGRESS.md
   (flip the cross-check row to ✅ with the fix noted).

VERIFY GATE:
  pnpm -F @max-core/react typecheck
  pnpm -F @max-core/react build            # rebuild dist BEFORE the two below
  cd apps/storybook && npx tsc --noEmit -p tsconfig.json
  pnpm -F @max-core/tokens drift
  npx biome check --write <changed files>

RECURRING LESSON: the failures are MISSING axes/states/tier, not wrong numbers — the drift
gate guarantees dimensions, never appearance. Treat the master + its spec text as the truth.

Branch: feat/phase3-buildout. Work tier by tier from the PROGRESS.md cross-check table /
PLAN.md Part D batches; ~28 components still unverified. I'll tell you which to start with.
Use a scratch dir for screenshots (not /tmp).
```

---

## Why this process exists

Components were built from the exported `tokens.json` `components` block, which carries only
**dimensions** (spacing/size/radius) — not states, colors, per-variant fills, or whole axes. A
component can therefore be **drift-green yet visually wrong or missing a variant**. This pass
reconciles each one against its Figma showcase before Phase 4.

**Findings so far** (all were drift-green but still wrong): Badge missing a whole variant axis;
PayButton conflating Color with Provider; Tag treating Selected as a focus ring; LinkButton bold
with no Pressed state; Checkbox/Radio/Switch missing the Validation axis + helper text.
