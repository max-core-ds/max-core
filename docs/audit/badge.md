# Audit — Badge page (Phase 4.5)

- **Figma page:** Badge `2183:163`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Badge `51:656` (Size S/M/L × Variant Default/Outline/Ghost × Tone ×4 = 36 variants; `Label` text)
- **React:** `Badge`
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ variant/tone/size ↔ Variant/Tone/Size; `children` ↔ `Label`. No `neutral` tone in Figma. ❌ `apps/showcase` used `<Badge tone="neutral">` (a pre-existing tsc failure) → **[code]** changed to `variant="outline"`. |
| 2 | States | n/a. The doc says "non-interactive" and React renders a `<span>` ✅ |
| 3 | Colours | ✅ status Default = `status/*/subtle` + `/border` + `/default`; Ghost = tone text. ❌ **Default/Default:** border `accent/active` + label `text/accent` (React `border/accent` + `accent/default`) → **[code]**. ❌ **Outline status** borders bind `status/*/border` (React used the solid tone) → **[code]**, via the new shared `statusBorderOutline` (also used by Tag). Outline Default = `accent/default` border + text ✅. |
| 4 | Dimensions | ✅ Padding X/Y S 10/6, M 12/8, L 14/10; Radius sm; Border thin. ❌ The Figma frames render 21/25/29 tall because the label text box is stuck at 9px (Caption 12 @ 130% should be about 16px), the same stale-text-box artifact as Segmented → [designer]. React = padding + 16px line. |
| 5 | Typography | ❌ **Figma `Caption/300` (12px Light) at every size**; React was bold at 10 / 12 / 14px → **[code]** `text-xs font-light` for all sizes. |
| 6 | Anatomy | ✅ a single frame with one text node |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ The `<span>` is fine for a status label. Contrast: **Badge now passes** (was a dark-mode `accent/default` on `accent/subtle` finding; Figma's `text/accent` resolves it). |
| 9 | Doc page | ✅ The anatomy and token architecture match. |
| 10 | Story | ✅ Controls cover every axis; AllVariants matrix. |

## Code fixes applied
1. Label `text-xs font-light` at every size (Caption/300).
2. Default/Default: `accent/active` border + `text/accent` label.
3. Outline status borders → `status/*/border` (new shared `statusBorderOutline` in `utils/tone.ts`; Tag's local table moved there).
4. `apps/showcase`: `tone="neutral"` → `variant="outline"`, so showcase tsc is green again.

**Contrast baseline:** 24 findings / 15 of 23 components (was 25 / 16; Badge fixed).
**Verified:** typecheck, build, Storybook tsc, **showcase tsc** (now passes), drift ✅. Playwright AllVariants in light and dark.

## For the designer (→ PROGRESS.md)
- Label text box is stuck at 9px high, so the frames render 21/25/29 tall instead of about 28/32/36.
