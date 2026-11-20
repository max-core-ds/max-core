# Audit — Selection Controls page (Phase 4.5)

- **Figma page:** Selection Controls `42:1366`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Checkbox `2145:366` / .Checkbox-options `120:4621` · Radio Button `2145:10514` / .Radio-button option `48:943` · Switch `2145:10878` / .Switch-options `48:1282`
- **React:** `Checkbox`, `Radio` (+ `RadioGroup`), `Switch`, `utils/validation.ts`
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text
- **Contrast:** unchanged at 19 findings / 15 of 23 components. None of the three controls has text-on-fill pairings in the audit.

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Shared (all three)

| Area | Finding | Class |
|---|---|---|
| API | ✅ The Figma wrappers are standalone components (no variants) with Show Label / Show Helper / Focused booleans and label/helper text. React `label` / `helperText` / `errorMessage` cover these. React's `size` and `validation` come from the inner options sets. | — |
| Typography | ❌ **Label:** Checkbox/Radio `Body/SM/300`, Switch `Body/MD/300` (React inherited 16px Regular). **Helper:** `Caption/300` `text/secondary` (React `text-sm` `text/muted`). → **[code]** fixed. Checkbox and Radio use SM while Switch uses MD, which is inconsistent → [designer] | code / designer |
| Layout | ✅ Item Gap 8, Text Gap 6. ❌ The Figma wrapper centres the control against the text block; React top-aligns it with the label → **[deviation]** (user decision: top-align is the industry norm when helper text wraps) | deviation |
| A11y | ❌ The helper and error text weren't linked to the control → **[code]** `aria-describedby`. Disabled now also sets `pointer-events-none`, so hover/pressed fills can't fire on it. | code |
| Focus | React ✅ (`focusRing` on the control only, a pressable). Figma ❌: the Checkbox has **two Focused booleans and two ring mechanisms**. The wrapper has its own `.Focus-ring` (`2145:4987`) and `Focused`. The inner `.Checkbox-options` has a second `Focused` + `.Focus-ring` in 40/48 variants (1px), and it is exposed through the nested instance, so both toggles show in the panel. They aren't visible together by default. **The wrapper's ring is malformed:** 14×4 at (-3, 17), a sliver below the 16×16 box, so turning on `Focused` doesn't draw a ring around the control. Radio and Switch carry only the wrapper ring. Focused is a BOOLEAN ✅. → [designer]: one `Focused` + one ring sized around the control, at 2px. | designer |
| Disabled | ❌ Figma: Checkbox Disabled swaps the stroke to `border/accent` (opacity is fine). Radio and Switch have **no Disabled variant**. React = opacity only ✅ → [designer] | designer |
| Hover/Pressed | **Decision: match Figma exactly** (user, 2026-10-24). The unchecked or off control takes **solid** fills. I raised the concern that hover/pressed on an unchecked control reads as checked (Pressed `accent/active` is darker than checked `accent/default`; Error hover `danger-700` is darker than checked `danger-600`; dark mode `accent/hover` sits next to `accent/default`). The user chose Figma. Checked/on has no interaction variants in Figma, so none in React. | code |

## Checkbox

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ Checked = Unchecked / Checked / Intermediate ↔ `checked` / `indeterminate`. Size S/M, Validation ×4. |
| 2 | States | ❌ → **[code]** added unchecked Hover (`overlay/hover` + `border/accent`, or `status/*/hover`) and Pressed (`accent/active` + `border/accent`, or `status/*/active`). |
| 3 | Colours | ✅ Unchecked `bg/default` + `border/default`; validation `status/*/subtle` + `status/*/border`; checked = tone fill + `text/on-accent` icon. ❌ The checked Default border is `border/accent` (React used `accent/default`) → **[code]**. ❌ Success unchecked stroke binds `status/success/default` where the other tones use `/border` → [designer]. React stays on `/border`. |
| 4 | Dimensions | ✅ Global Size S/M 16/24 (aliases Spacing), Radius xs, Border thin. ❌ The M check icon width binds the orphan `--- Atoms ---/--- Selection-controls/-Radio button & checkbox/lg-size` → [designer] |
| 5–10 | | Typography/A11y/Focus: see Shared. Anatomy ✅. Doc page ✅ (token table matches). Story ✅ (Validations, Sizes, Indeterminate, WithError). |

## Radio

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ Checked Off/On, Size S/M, Validation ×4. `RadioGroup` is React-only (group label/helper), which is reasonable. |
| 2 | States | ❌ → **[code]** added unchecked Hover (`accent/hover` + `border/accent`) and Pressed (`accent/active` + `border/default`), with `status/*/hover|active` per validation. Figma's state for "On" is named `Active` (no interaction). |
| 3 | Colours | ❌ The Default fill is `bg/surface` (React `bg/default`), and checked **keeps `border/default`** (React promoted it to accent) → **[code]**. Dot = tone default ✅. |
| 4 | Dimensions | ✅ 16/24 box, radius full, border thin. Dot 10/15 in Figma vs 10/14 via Dot Padding 2/4 → within 1px, kept (tokenized). |
| 5–10 | | See Shared. Doc ✅. Story ✅. |

## Switch

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ Checked Off/On, Size S/M, Validation ×4 |
| 2 | States | ❌ → **[code]** Off Hover: track `accent/hover` (`status/*/hover`). Off Pressed: same track, plus a frosted **glass knob** (`overlay/default white` @ 20% + tone stroke + blur). Figma's `effect/blur/xs` isn't exported → `backdrop-blur-xs`. |
| 3 | Colours | ❌ **The whole Off design was wrong.** Figma Off = `bg/surface` track + `border/default` stroke + **accent knob** (validation: `status/*/subtle` track + `/border` stroke + `status/*/default` knob). React had a `neutral/default` (near-black) track with a white shadowed thumb → **[code]**. On = tone fill + `text/on-accent` knob (React used `bg/surface`, which turns dark in dark mode) → **[code]**. No knob shadow in Figma → removed. |
| 4 | Dimensions | ❌ Track S **32×18** / M **40×22**, knob **14 / 18** (React 20/24 and 16/20). Track border thin added (`Switch/Border Width`) → **[code]**. Width/Knob Padding tokens ✅. |
| 5–10 | | Label `Body/MD/300` (see Shared). Doc ✅. Story ✅. |

## Code fixes applied
1. `utils/validation.ts`: Checkbox/Radio/Switch tables rewritten to the master bindings (unchecked Hover/Pressed, Radio surface + unchanged checked border, Checkbox `border/accent` when checked), plus a new `switchKnobValidation`.
2. Switch: 18/22 track with a 1px border, 14/18 knob, tone knob off / on-accent knob on, glass knob on press, no shadow.
3. Label `text-sm font-light` (Switch `text-base font-light`). Helper/error `text-xs font-light`, helper in `text/secondary`.
4. `aria-describedby` → helper/error. Disabled → `pointer-events-none`.

**Verified:** typecheck, build, Storybook tsc, drift ✅ (Checkbox/Radio/Switch conform), contrast unchanged. Playwright: validation matrices in light and dark, unchecked hover and pressed for each control, Switch S off / M on in light and dark. `aria-describedby` resolves to the helper text.

## For the designer (→ PROGRESS.md)
- Reconsider the solid unchecked Hover/Pressed fills (shipped as-is by decision). Pressed and Error Hover are darker than the checked fill, so unchecked reads as checked.
- Checkbox focus: the wrapper ring is malformed (14×4 sliver below the box), and the inner options set duplicates `Focused` + ring (40/48 variants, exposed). Keep one, sized around the control, at 2px.
- Add Disabled to Radio and Switch. Checkbox Disabled: keep the stroke, opacity only.
- Checkbox Success unchecked stroke `status/success/default` → `/border`.
- Checkbox M icon width bound to the orphan `---` token.
- Label type: Checkbox/Radio `Body/SM/300` vs Switch `Body/MD/300`. Pick one.
- Wrapper alignment: React top-aligns the control with the label; consider matching that in Figma.
- Switch Pressed knob stroke: S binds `border/default`, M binds `accent/default` (inconsistent).
