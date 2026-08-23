# Prompt — Continue the Figma visual cross-check

> **How to use:** paste the block below to start a new conversation that continues the
> Phase 3.5 visual cross-check of `@max-core/react` against the Figma showcases. It also
> reads as a reference for the process. To build a *new* component instead, use
> [`implement-component.md`](./implement-component.md).

---

```
I'm continuing the Max Core design-system work: cross-checking the React component
library (packages/react) against the Figma showcase pages and fixing whatever the raw
tokens didn't capture (missing states, colors, or whole variant axes).

READ FIRST (in this order):
- PROGRESS.md          — live status: every shipped component, its Storybook title, and
                         its cross-check status. Source of truth for done vs. pending.
- PLAN.md → "Phase 3.5 — Visual cross-check against Figma showcases" — the process,
                         step by step, plus findings/lessons so far.
- CLAUDE.md + docs/MAX-CORE-SUMMARY.md — design-system rules and token conventions.

THE INPUT:
figma-node-links/*.json holds one exported showcase node tree per component group
(variant names + description text nodes that carry the real spec). Finished files are
moved to figma-node-links/checked/. Pending files are the ones still in the top folder.
Figma file key: the showcase nodes live in the PRODUCTION file ouyi08XxN4l4VCsao1nNQu.
(The cross-check file sX5tikviuBEhNbu2iPVya5 only holds a subset of pages; when a node
ID isn't found there, fall back to the production key.) Verify with get_metadata (no
nodeId) to list pages if a lookup fails.
Node IDs use colons (51:656); Figma URLs use dashes (node-id=51-656).

THE LOOP (one file at a time, in the order I give you — don't jump ahead):
1. node figma-node-links/summarize.js figma-node-links/<file>.json   → axes + descriptions
2. Read the matching React component(s) and list gaps vs. the Figma spec.
3. Confirm intent with the Figma MCP: get_screenshot (curl the URL → PNG → Read),
   get_variable_defs, and get_design_context for exact bound tokens. Map by TOKEN NAME,
   not hex (hex depends on the file's light/dark mode).
4. Fix — shared color literals go in packages/react/src/utils/* (Tailwind can't see
   interpolated classes; every class must be a full literal). Match Figma variant names.
5. Verify (the gate below). Rebuild @max-core/react before the Storybook tsc + drift —
   both read the built dist.
6. Update the story to expose any new axis (add an AllVariants/matrix story).
7. One commit per file (message names the Figma finding), git mv the file into
   figma-node-links/checked/, and update PROGRESS.md.

VERIFY GATE:
  pnpm -F @max-core/react typecheck
  pnpm -F @max-core/react build            # rebuild dist BEFORE the two below
  cd apps/storybook && npx tsc --noEmit -p tsconfig.json
  pnpm -F @max-core/tokens drift
  npx biome check --write <changed files>

RECURRING LESSON: the failures are MISSING axes/states, not wrong numbers — the drift
gate guarantees dimensions, never appearance. Treat the description nodes as the spec.

Branch: feat/phase3-buildout. Pending files, in order:
segmented-control → list-item → search-bar → top-bar → bottom-bar → sidebar
(plus any new files I add later). Start with the first one still in figma-node-links/.
I'll paste the Figma page if you need it. Use a scratch dir for screenshots (not /tmp).
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
