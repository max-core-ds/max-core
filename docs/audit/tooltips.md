# Audit — Tooltips page (Phase 4.5)

- **Figma page:** Tooltips `2070:9738`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Tooltips `7182:11952` (Position Bottom/Top/Left/Right; `Text` property)
- **React:** `Tooltip` (Base UI tooltip) + the shared `utils/tooltip-surface.ts` (also the Range value bubble)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads, a variant screenshot and doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `content` ↔ Text; `side` ↔ Position, but ❌ Figma's **Position names the arrow edge**, not where the tooltip sits: Position=Bottom (the default) has the arrow at the bottom, so the bubble is *above* its trigger = React `side="top"` (also the React default, so the defaults agree) → [designer] rename to the side it opens on, or document the mapping. **[deviation]** `sideOffset`, `delay`/`closeDelay`, `rootProps` are behaviour with no Figma counterpart. |
| 2 | States | n/a. Open/closed is behaviour (hover/focus, Base UI). |
| 3 | Colours | ✅ Bubble + arrow `neutral/default`, text `text/on-accent-muted` (an inverted surface: 16.3 light / 14.0 dark, and about 17:1 against the page). ❌ React added `effect/shadow/down/md`; the master has **no effect** → **[code]** removed (the inverted fill separates it from the page on its own). |
| 4 | Dimensions | ✅ Padding 16, Radius md. ❌ **Arrow:** React used an 8px rotated square (about 11px wide, sticking out about 6px). The master's Arrow polygon shows about 16px wide at the bubble edge and about 14px deep → **[code]** an SVG triangle 16×12 (`--size-16` × `--spacing-12`); Arrow Radius (`--radius-xs`) rounds the corners via a round-joined stroke 2× the radius wide, so the token stays bound (drift ✓). Shared by Tooltip (rotated per side) and the Range bubble. ❌ Text box stuck at 9px tall → the frames read 41px instead of about 48 (16 + 15.6 + 16) → [designer]. Nit: `minWidth` bound to `- Size -/24`, which can never apply (padding alone is 32) → [designer]. |
| 5 | Typography | ✅ `Caption/300` → `text-xs font-light`. |
| 6 | Anatomy | ✅ Bubble (hug, centred) + Arrow; React's arrow follows Base UI's `data-side`, including collision flips (verified: a cramped `side="right"` flips left and the arrow follows). |
| 7 | Focus | n/a. The trigger owns focus; Base UI opens the tooltip on keyboard focus as well as hover. |
| 8 | A11y | ✅ Base UI wires `role="tooltip"` + `aria-describedby`, opens on focus, closes on Escape. Contrast passes (Tooltip isn't in the findings). |
| 9 | Doc page | ✅ Tokens, colours and structure match. See #1 for the Position naming (the doc says "Position (VARIANT: Bottom / Top / Left / Right)" without saying it's the arrow edge). |
| 10 | Story | ✅ Default (hover + delay Controls) and Positions (forced open on all four sides; Controls can't show four at once). |

## Code fixes applied
1. Removed the bubble shadow (`tooltipBubble`); the master has no effect.
2. New arrow: an SVG triangle 16×12 with the corners rounded by Arrow Radius (`tooltipArrow` + `TOOLTIP_ARROW_VIEWBOX`/`TOOLTIP_ARROW_PATH`), with per-side offset + rotation in `Tooltip`, and placed under the Range value bubble.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Tooltip ✓, Range ✓). Playwright light + dark: all four positions (forced open, incl. a collision flip), Range with tooltip; computed `box-shadow: none`.

## For the designer (→ PROGRESS.md)
- Position values name the arrow edge (Position=Bottom = tooltip above the trigger). Rename them to the side the tooltip opens on, or document the mapping.
- The text box is stuck at 9px high, so the frames read 41px instead of about 48.
- `minWidth` is bound to `- Size -/24`, which can never apply. Consider a max width for long text instead (none is specified).
