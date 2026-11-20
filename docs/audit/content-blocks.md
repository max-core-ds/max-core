# Audit — Content blocks page (Phase 4.5)

- **Figma page:** Content blocks `2860:8116`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Heading Block `2874:2` (`Text` TEXT), Text Block `2874:4` (`Text` TEXT), Image Placeholder `2876:2` (no properties), all standalone COMPONENTs
- **React:** `HeadingBlock`, `TextBlock`, `ImagePlaceholder`
- **Audited:** 2026-10-24, via a read-only `use_figma` bound-variable read (the page has no doc text beyond the masters)

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `children` ↔ the `Text` property on Heading/Text Block, with defaults ("Heading" / a placeholder sentence). Image Placeholder has no props in either. |
| 2 | States | n/a (static). |
| 3 | Colours | ✅ Heading `text/primary`, Text `text/secondary`, Image Placeholder `bg/subtle` + label `text/muted`. The placeholder icon strokes are **hardcoded `#94A3B8`** (the dark-mode `text/muted` value, unbound) → [designer]. React uses `currentColor` = `text/muted`, so it follows the mode. |
| 4 | Dimensions | ✅ Heading/Text Block Padding X 2px (`-- Atoms/Content Blocks/Padding X`). ❌ Image Placeholder: **no corner radius** in the master (React had `radius.md`), **8px gap** (React 4px), **48px icon** (React 32px) → **[code]** all three fixed. The master is a fixed 343×200; React fills its container at 16:9 → [deviation] (a placeholder for slots has to be fluid). |
| 5 | Typography | ✅ Heading Heading/H6 → `text-xl font-bold`; Text Body/SM/300 → `text-sm font-light`; label Caption/300 → `text-xs font-light`. |
| 6 | Anatomy | ✅ Block → padded frame → text; placeholder → icon + label. Inner frames are named `Frame 1` / `Frame 2` → [designer] nit. |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ Icon `aria-hidden`. Heading Block is a `div`, not `<h*>`, because the heading level depends on where it's placed → pass `role="heading"` + `aria-level`, or wrap it, when it's a real heading. |
| 9 | Doc page | ❌ The page has no documentation frame (no description, token table or usage) → [designer]. The masters have no descriptions. |
| 10 | Story | ✅ The Overview story composes all three (no axes to control). |

## Code fixes applied
1. ImagePlaceholder: square corners, `spacing-08` gap, `size-48` icon.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Content Blocks ✓), biome. Playwright light + dark of Overview; computed gap 8px / radius 0 / icon 48px.

## For the designer (→ PROGRESS.md)
- The Content blocks page has no documentation frame, and the masters have no descriptions.
- Image Placeholder icon strokes are hardcoded `#94A3B8`; bind them to `text/muted`.
- Inner frames are named `Frame 1` / `Frame 2`.
