# Audit — Divider page (Phase 4.5)

- **Figma page:** Divider `2080:11623`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Divider `7190:12` (one variant, Style=Default): a horizontal VECTOR line
- **React:** `Divider` (Base UI `Separator`); also used inside `ItemList`
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ Style has one value (Default), so React has no style prop (YAGNI; the doc calls it "extensible for dashed/dotted"). **[deviation]** `orientation="vertical"`: Figma draws only the horizontal line; the vertical one is the same hairline for toolbars and inline groups (`self-stretch` in a flex row). |
| 2 | States | n/a (non-interactive) |
| 3 | Colours | ✅ Stroke `border/default` (#64748B light / #94A3B8 dark, measured). |
| 4 | Dimensions | ✅ 1px, full width (Figma constraint horizontal SCALE ↔ `w-full`). ❌ The thickness was a hardcoded `h-px`/`w-px`, so it wouldn't follow `-- Atoms/Divider/Border Weight` → **[code]** `h-/w-[var(--border-weight-thin)]` (the token aliases `- Border Weight -/thin`; drift doesn't check border weights, see the `drift.ts` note). |
| 5 | Typography | n/a |
| 6 | Anatomy | ✅ A single line. React draws it as a filled 1px box instead of a stroke; the result looks the same. |
| 7 | Focus | n/a |
| 8 | A11y | ✅ `role="separator"` + `aria-orientation` from Base UI (verified for both orientations). Purely decorative uses can pass `aria-hidden`. |
| 9 | Doc page | ✅ Token chain, colour and structure match. |
| 10 | Story | ❌ The `Horizontal`/`Vertical` stories ignored their args, so the `orientation` control did nothing → **[code]** one `Default` story driven by Controls (its wrapper switches between a stacked and an inline layout). |

## Code fixes applied
1. Thickness bound to `--border-weight-thin` (was `h-px`/`w-px`).
2. Story: a single Controls-driven `Default` replaces the two arg-ignoring stories.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Divider ✓). Playwright light + dark: both orientations (1px measured, colour + `aria-orientation` checked).

## For the designer (→ PROGRESS.md)
- Nothing blocking. Optional: add a vertical variant (React ships one), or drop the single-value Style axis until a second style exists.
