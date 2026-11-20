# Audit — Spinner page (Phase 4.5)

- **Figma page:** Spinner `51:181`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Spinner `7192:12` (Size S/M/L/XL × Style Brand/Neutral/Inverse = 12 variants; `Show %` BOOLEAN, XL only)
- **React:** `Spinner`
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads, a master screenshot and doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `size` s/m/l/xl ↔ Size. ❌ `tone` values `accent`/`neutral`/`on-accent` didn't match Style **Brand/Neutral/Inverse** → **[code]** renamed to `brand`/`neutral`/`inverse` (breaking, but no consumers outside the story). The prop stays `tone` because `style` would collide with React's `style`. ❌ **`Show %` was missing** → **[code]** new `value` (0–100) renders the percentage in the centre; TypeScript only allows it with `size="xl"`, as in Figma. |
| 2 | States | n/a (always animating; no states in Figma). |
| 3 | Colours | ✅ Brand `accent/subtle` + `accent/default`; Neutral `neutral/subtle` + `neutral/active`. ❌ **Inverse was swapped:** React had an `accent/active` track + white arc; Figma has a **`text/on-accent` (white) track + `accent/active` arc** → **[code]** fixed. ❌ In dark mode the Inverse arc (`accent/active` #A5B4FC) barely separates from an `accent/default` background (#818CF8) → [designer] (shipped as Figma). The % label is `text/primary` in every Style, which would be dark on an accent background for Inverse → [designer] (shipped as Figma). |
| 4 | Dimensions | ✅ Size 16/20/24/48. ❌ **Ring thickness: Figma conflicts with itself.** The Track/Indicator ellipses are *filled donut arcs* (innerRadius 0.63 S–L, 0.75 XL → ring = 37% / 25% of the radius, about 3 / 3.7 / 4.4 / 6px), while the bound `Track Stroke` (thin 1px) / `Indicator Stroke` (thick 2px) sit on strokes with no paint and never render. React drew 2px for both at every size. **User decision: follow the render** → **[code]** SVG rewrite with a proportional ring (track = arc width), hardcoded geometry with the reason in a comment; the stroke tokens are unused → [designer] (either drive the ring from the tokens or remove them). |
| 5 | Typography | ✅ The % label is `Body/SM/700` → `text-sm font-bold` (+ `tabular-nums`). "100%" (about 38px) is slightly wider than the XL inner hole (36px) → [designer] nit. |
| 6 | Anatomy | ✅ Track (full ring) + Indicator (quarter arc) (+ label on XL). The SVG spins and the label stays upright. |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ `role="status"` + `aria-label` ("Loading" by default); with `value` → `role="progressbar"` + `aria-valuenow/min/max` (verified in the DOM). No text contrast pairing except the label (`text/primary` on the page passes). |
| 9 | Doc page | ✅ 12 variants, 6 tokens, structure. ❌ It says "Track … thin stroke weight / Indicator … thick stroke weight", but those strokes have no paint (see #4) → [designer]. |
| 10 | Story | ✅ Controls: size, tone, `value` (shown only when size = xl); AllSizes + Tones matrices; new WithPercent story. |

## Code fixes applied
1. SVG rewrite: proportional ring per the master render (37% / 25% of the radius), quarter indicator arc, spinning SVG.
2. Inverse colours un-swapped (white track, `accent/active` arc).
3. `tone` values renamed to Figma's Style: `brand` / `neutral` / `inverse`.
4. New `value` (XL only, type-enforced): centred `Body/SM/700` percentage + determinate `progressbar` semantics.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Spinner ✓). Playwright light + dark (animation paused): AllSizes, Tones, WithPercent; the progressbar ARIA was checked.

## For the designer (→ PROGRESS.md)
- Ring thickness comes from the arcs' innerRadius (0.63 / 0.75). The bound Track/Indicator Stroke tokens sit on strokes with no paint, so they never render. Drive the ring from the tokens, or remove them (React follows the render).
- Inverse in dark: the `accent/active` arc on an `accent/default` background is hard to see.
- The % label is `text/primary` for every Style; for Inverse it should probably be `text/on-accent`.
- "100%" overflows the XL inner hole slightly.
