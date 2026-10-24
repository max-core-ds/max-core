# Audit — Range page (Phase 4.5)

- **Figma page:** Range `2092:8276`, working file `sX5tikviuBEhNbu2iPVya5` (doc frame `7255:11`)
- **Master:** Range `2508:11276` (standalone COMPONENT, 300 × 33: `Show Tooltip` BOOLEAN, default true; Progress bar `Value=50, Size=S` with its Labels on; a `Knob` frame = Tooltips `Position=Bottom` + Knob `Default`, gap 16)
- **React:** `Range` (Base UI Slider, composed from the Progress Bar track/fill, `Knob` and the Tooltip surface)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads of the master, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Range

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Show Tooltip → `showTooltip`. **Decision:** stays off by default (Figma: on), like the bound labels that stayed opt-in on the Progress Bar page → [deviation, on the designer list]. ✅ Labels → `showLabels` + `formatLabel` (the master always shows them; Range doesn't expose the Progress Bar's Show Range Labels). React adds dual thumbs (array value) and the Base UI slider props [deviation, kept]. |
| 2 | States | ✅ Knob Default / Hover / Pressed live on the thumb. ❌ **Disabled** only disabled the input: the knob kept its hover / pressed look and nothing dimmed → **[code]** the whole slider dims once at `opacity/disabled` (`data-disabled`), the knob is forced to its default handle (no second opacity), no pointer events. The master has no Disabled; the Knob atom's Disabled is the model. |
| 3 | Colours | ✅ Track `accent/subtle`, fill `accent/default` (Progress Bar S); knob `bg/surface` + `neutral/subtle` handle + shadow sm; tooltip `neutral/default` + `text/on-accent-muted`; labels `text/primary`. |
| 4 | Dimensions | ✅ Track height Size S (4), Tooltip Knob Gap 16, Knob 24 / padding 4. ❌ The control was 20px tall (`py-8` around the 4px track) and the labels sat a further 8 below it: **16px under the track** vs the master's 8 (Progress Bar Item Gaps) → **[code]** the control is knob-tall (24, track centred), labels pulled up by the 10px knob overhang → 8 below the track (measured). The `Knob` frame's gap of 16 is an unbound `itemSpacing`; the doc says it's the Tooltip Knob Gap token → [designer]. |
| 5 | Typography | ✅ Labels and tooltip Caption/300 = `text-xs font-light`. |
| 6 | Anatomy | ✅ Progress Bar + Knob + Tooltip (arrow down, bubble above the thumb). |
| 7 | Focus | ✅ `focusRingWithin` on the thumb (from the Knob page). Figma: the Knob's `.Focus-ring` (1px). |
| 8 | A11y | ✅ Base UI: `input type=range` per thumb, `aria-valuenow`, arrow keys; disabled → input disabled, clicks ignored (verified). ❌ Dragging selected the other tooltip's text → **[code]** `select-none`. Contrast n/a (the tooltip is the Tooltip atom's inverted surface, ~17:1). |
| 9 | Doc page | ✅ 1 token (Tooltip Knob Gap) — but it isn't bound (see #4). Says "knob and fill scale proportionally" ✅ (the responsive fix). |
| 10 | Story | ❌ `disabled` wasn't in Controls (Storybook ignored the URL arg) → added. Story top padding 8 → 20 so the tooltip isn't clipped. |

## Also fixed
- **Fill lagged the knob while dragging:** the shared `progressFill` animates its width (right for the Progress Bar), so the Range fill trailed the thumb → `transition-none` on the Range indicator. Verified mid-drag: fill end = knob centre.
- **Contrast audit blind spots** (`contrast.ts`): the literal extractor read comments too, so an apostrophe in a comment ("doesn't") opened a fake string and misaligned every class list after it. That hid Pagination (since its audit commit), the Tabs pressed state and Radio. It now strips comments first (line comments before blocks, or `Molecule/Pin/*` reads as a block opener). Tabs' manual pressed override removed (now extracted). Baseline **30 findings / 19 of 31** (Radio entered, passes).

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast as above. Playwright light + dark, clicked through: knob centred on the track (top 48 / track 58–62), labels 8 below the track; drag to the end → 100; keyboard Arrow keys; disabled → opacity 0.4, input disabled, a click leaves the value at 40; dual thumbs with tooltips, fill tracks the dragged thumb, no text selection.

## For the designer (→ PROGRESS.md)
- `Show Tooltip` defaults to true; React keeps the tooltip opt-in (decision).
- The `Knob` frame gap (16) is unbound; bind it to `-- Molecule/Range/Tooltip Knob Gap` (the doc says it is).
- No Disabled state on Range (React dims the whole slider like the Knob atom).
