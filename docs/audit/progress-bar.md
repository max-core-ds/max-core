# Audit — Progress Bar page (Phase 4.5)

- **Figma page:** Progress Bar `2205:29`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Progress bar `7193:12` (Value 0/25/50/75/100 × Size S/M/L = 15 variants; `Show Range Labels` BOOLEAN, default on)
- **React:** `ProgressBar` (track + fill shared with `Range` via `utils/progress.ts`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads and the doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `size` s/m/l ↔ Size; `showRangeLabels` ↔ Show Range Labels. Value is a continuous number instead of the 5 Value steps (Figma can only show snapshots). ❌ **`min` was accepted but never passed to Base UI**, so a custom `min` changed the label but not the fill or `aria-valuemin` → **[code]** passed through. Show Range Labels defaults to **on** in Figma, **off** in React → **[deviation]** by user decision (a plain bar is the common case; opt in). |
| 2 | States | n/a (no states in Figma). `value={null}` gives Base UI's indeterminate state with an empty track; Figma has no indeterminate design (Spinner covers "loading, unknown duration"). |
| 3 | Colours | ✅ Track `accent/subtle`, fill `accent/default`, labels `text/primary`. The track also has a `border/default` stroke, but its weight resolves to 0 (Border Weight → none), so nothing renders and React draws no border. |
| 4 | Dimensions | ✅ Heights 4/8/16 (Size S/M/L Height), radius full (fill too), Item Gaps 8px between bar and labels. ❌ Labels row gap `- Spacing -/04` was missing (labels are space-between, so it only matters when they'd touch) → **[code]** added. |
| 5 | Typography | ✅ Labels Caption/300 → `text-xs font-light`. Label text boxes are 9px tall in Figma (the known text-box artifact; Caption/300 line height is about 16px) → [designer]. |
| 6 | Anatomy | ✅ Track → fill; Labels row (min left, max right). |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ `role="progressbar"` + `aria-valuenow/min/max/valuetext` from Base UI. ❌ The range labels repeated min/max to screen readers → **[code]** `aria-hidden`. The bar has no visible label in Figma, so the prop docs now say to pass `aria-label`/`aria-labelledby`; the stories do. |
| 9 | Doc page | ✅ 15 variants, 9 tokens, structure. ❌ The track stroke weight is bound to `Atoms/Progress Bar/Size s|m|Lg/Border Weight`: variables that aren't in the local collection (orphans, no `--` prefix, `Lg` instead of `L`). They alias Global/Border Weight, so the value is right, but the binding should point at `-- Atoms/Progress Bar/Global/Border Weight` → [designer]. Value=100 Size=S fill radius is bound to Size **L**/Radius (same value) → [designer] nit. Child names differ across variants (Progress / Progress Indicator / Progress fill; Min Value / Min Value Label / Min label) → [designer]. |
| 10 | Story | ✅ Controls: value, size, showRangeLabels; Sizes + WithRangeLabels. Added `aria-label` to the args and the Sizes matrix. |

## Code fixes applied
1. `min` passed to `Progress.Root` (fill and `aria-valuemin` now follow it).
2. Range labels `aria-hidden` + `- Spacing -/04` gap.
3. Prop docs: value range and the accessible-name requirement.
4. Story: `aria-label` on every bar.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Progress Bar ✓), biome. Playwright light + dark: Sizes, WithRangeLabels; the progressbar ARIA was checked in the DOM.

## For the designer (→ PROGRESS.md)
- Track stroke weight is bound to orphan variables `Atoms/Progress Bar/Size s|m|Lg/Border Weight` (not in the local Components collection). Rebind to `-- Atoms/Progress Bar/Global/Border Weight`.
- Value=100 Size=S fill radius is bound to Size L/Radius.
- Child layer names differ between the Value variants; unify them (Track / Fill / Min Label / Max Label).
- Label text boxes are 9px tall (Caption/300 needs about 16px).
