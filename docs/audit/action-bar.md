# Audit — Action bar page (Phase 4.5)

- **Figma page:** Action bar `4036:11309`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Action Bar `4112:93` (COMPONENT_SET: `Direction` Horizontal / Vertical; `Button Group` SLOT, 4 preferred Button sets; 26 instances)
- **React:** `ActionBar` (layout-only; Buttons as children)
- **Audited:** 2026-10-25, via a read-only `use_figma` read of the set, its slot content, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Direction → `direction`; Button Group slot → `children`. Default content (2 × Button S Primary) is only the example; button size / variant stay the caller's. |
| 2 | States | n/a (layout only; the Buttons own their states). |
| 3 | Colours | n/a (no colour tokens, as the doc says). |
| 4 | Dimensions | ✅ Gap 8 (Global/Gap on itemSpacing). ❌ Horizontal buttons were **not equal**: `flex: 1 1 0%` can't go below a button's padding + border, so a bordered Secondary came out 189 vs 187 next to a Primary; the master's are FILL / grow 1, equal (170 / 170) → **[code]** horizontal is a grid of equal columns `minmax(160px, 1fr)`. The Date picker footer lifts the minimum with `auto-cols-[minmax(0,1fr)]` (was `[&>*]:min-w-0`). ✅ Vertical: buttons FILL the width. Button Min Width 160 is documented but **bound nowhere** in the master (minWidth null) → [designer]; React keeps the doc's 160. |
| 5 | Typography | n/a. |
| 6 | Anatomy | ✅ One row / column of Buttons, NO_WRAP. |
| 7 | Focus | n/a (each Button has its `focusRing`). |
| 8 | A11y | ✅ Plain container; the buttons are native. |
| 9 | Doc page | ✅ 2 tokens + chains. ❌ "min-width: 160px per button (token-controlled)" isn't bound (see 4). |
| 10 | Story | ❌ Title `Molecules/ActionBar` → **Molecules/Action Bar** (matches the Figma name and the other spaced titles; id now `molecules-action-bar--*`). Horizontal + Vertical kept (different content / widths). |

## Code fixes applied
1. Horizontal Action Bar = equal grid columns with the 160 minimum (bordered buttons no longer wider).
2. Date picker footer lifts the minimum through the grid template.
3. Story title `Molecules/Action Bar`.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright: Action Bar 188 / 188, Form Group S + premade 188 / 188 and 172 / 172, Date picker footer 138 / 138 (no overflow), Vertical 3 × 256.

## For the designer (→ PROGRESS.md)
- `-- Molecule/Action Bar/Global/Button Min Width` (160) is bound nowhere; the doc says it's token-controlled.
