# Audit — Inputs page (Phase 4.5)

- **Figma page:** Inputs `30:1348`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters (wrapper → options):** Base Input `119:13953` → `.Base-Input-Options` `32:1451` · Bottom Line Input `2278:3919` → `119:8125` · Stepper `120:2869` → `120:2418` · Textarea `120:2171` → `120:1238` · Select Input `2316:1293` → `2301:2906` · Multi-Select Input `2316:2233` → `.Multiselect-Options` `2316:1728`
- **React:** `Input`, `BottomLineInput`, `Stepper`, `Textarea`, `SelectInput`, `Multiselect` (+ the shared `utils/field.ts`; the DatePicker/TimePicker triggers share it)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads of all 12 sets, a wrapper screenshot, and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Shared field model (all six)

Every options set has the same anatomy: **Title** (Body/MD/700 `text/secondary`), the **Input** frame (stroke INSIDE, Radius md, Padding X 12, Inner Gap 8, Padding Y 12/12/16, Icon Size 16/20/24), and **Helper text** (Caption/300 `text/muted`), 8px apart (Items Gap). The wrapper sets add State (Default/Hover/Pressed/Active) and Disabled (opacity 0.4 on the **whole** wrapper).

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ❌ **Variant Primary/Secondary** (Base, Select, Multiselect) was missing → **[code]** `variant` (`secondary` = no fill). ❌ **Show Leading / Show Trailing** icons (Base, Bottom Line; Select's leading) were missing → **[code]** `leadingIcon` / `trailingIcon` (`FieldIcon`, `text/muted`, sized by Icon Size). ❌ Multiselect had no **Size** and no **disabled** → **[code]** added. Validation **Success** → [deviation], skipped by decision (Figma has it; no consumer needs it yet). **Breaking:** `className` now goes on the field wrapper (label + control + helper) instead of the control. |
| 2 | States | ❌ Figma **Hover/Pressed** = a state-layer wash over the field (Base/Bottom Line: `overlay/state layer` at 40% / 70%, a heavy grey; Textarea 20% / 35% + `border/hover`; Select/Multiselect `overlay/default black@0.20`). React had no hover. **Decision:** hover = `border/hover` only, no wash, no pressed (typing fields aren't pressed) → **[code]** `fieldHover` + [designer]. Stepper keeps Pressed = `accent/default` stroke while a ± button is held (the master's Pressed). ❌ **Active** = the typing state (caret shown): Title `text/accent`, `border/accent` → **[code]** the label turns `text/accent` on focus-within; the border follows the hybrid focus model (below). Select/Multiselect Active = open → `border/accent` while the popup is open. ❌ **Disabled** dimmed only the control → **[code]** `Field.Root` disabled dims the whole field (`fieldRoot`). |
| 3 | Colours | ✅ Base/Select/Multiselect fill `bg/default`, stroke `border/default`. ❌ **Textarea fill is `bg/surface`** (React `bg/default`) → **[code]**. ❌ **Error** was just a `status/danger/default` border → **[code]** the master's full set: Title + placeholder + helper `status/danger/default`, Primary fill `status/danger/subtle`, stroke `status/danger/border`, leading icon danger (`fieldInvalid` / `fieldInvalidFill`). Select placeholder showed in `text/primary` (`placeholder:` doesn't apply to a button) → **[code]** `data-[placeholder]` → `text/muted`. Multiselect chips: `bg/subtle` + `text-sm` → **[code]** the master's Badge S Default (accent/subtle fill, accent/active border, Caption/300 `text/accent`, padding 10/6, radius sm). Select/Multiselect popup border `border/muted` → `border/default` (the master's Item List). |
| 4 | Dimensions | ✅ Radius md, Padding X 12, Inner Gap 8, Padding Y 12/12/16, Icon Size 16/20/24, Min Width 160/180/200 (Multiselect 240), Textarea Min Height 96/120/160, Stepper Hit Area / Number Min Width. ❌ **Every field was 2px too tall:** Figma strokes are INSIDE, CSS borders add to the padding → **[code]** padding gives back the border; measured 40/44/56 (Textarea 120), matching the master. ❌ Items Gap (label ↔ field ↔ helper) was 4px → **[code]** 8px. ❌ **Bottom Line** had `px-0`; the master has Padding X 12 → **[code]**. ❌ Stepper number input took the browser's default width → **[code]** `field-sizing-content` (hugs above Number Min Width): 130/154/178 wide. |
| 5 | Typography | ❌ Title was `text-sm` `text/primary` → **[code]** Body/MD/700 `text/secondary` (`text-base font-bold`); the **Stepper** title scales per size in the master (S Caption/700, M Body/SM/700, L Body/MD/700) → followed. ❌ Helper/error were regular weight → **[code]** Caption/300 (`font-light`). Placeholder/value: the master uses **Caption/700** (S, M) and **Body/MD/700** (L); Textarea Caption/300 → [deviation] by decision: React keeps 12/14/16 regular for value + placeholder; [designer] confirm whether bold Caption is meant for typed text. |
| 6 | Anatomy | ✅ Title → frame (icons + text) → helper. ❌ Stepper ± were text glyphs → **[code]** minus/plus SVG icons at Icon Size, `text/secondary` (the master's colour). Multiselect gained the trailing **chevron** (Show Trailing): a `Combobox.Trigger` that opens the list and flips while open. The chip remove × is React-only (needed to remove a value without opening the list) → [deviation]. The expanded list (search, Select all, divider: an Item List) and the Select rows are left to the Item List / Dropdown pages. |
| 7 | Focus | ❌ Input/Textarea used the deprecated inset −3px ring, SelectInput the **outset** `focusRing` (wrong for a field), Multiselect/Stepper a 1px border recolour. **Hybrid model** → **[code]** all six use `focusBorder` (own border → `border/focus` 2px, no ring) via the shared `fieldBorder`. Bottom Line's underline is already 2px, so focus just recolours it. The DatePicker trigger also dropped its outset ring for `focusBorder` (it's a field). `focusRingInset` is deleted (no users left). Figma: every frame still carries a hidden 1px `.Focus-ring` bound to `Focused` → [designer] remove them (the seeded "≈81 rings" finding). |
| 8 | A11y | ✅ Labels via `Field.Label`. ❌ **Stepper's title was a plain `<span>`**, not associated with the input → **[code]** wrapped in `Field.Root` + `Field.Label` (+ `Field.Error` / `Field.Description`). Contrast: the field pairings were invisible to the audit (colours now live in `utils/field.ts`, and SelectInput had dropped out entirely) → `contrast-audit.ts` declares value / placeholder / error pairings per fill: all pass AA in light and dark. Coverage 24 → 27 components, still 16 with findings (25 findings). |
| 9 | Doc page | See the designer list below. |
| 10 | Story | ✅ Controls for size / variant / disabled where the axis exists; new WithIcons (Input), WithIcon (Bottom Line, Select); Stepper Sizes show the per-size title; AllSizes labels corrected (40/44/56). The Foundations/Focus Ring story now documents `focusBorder` instead of the removed inset ring. |

## Code fixes applied
1. `utils/field.ts` rebuilt: `fieldBorder` (border + placeholder + `focusBorder`), `fieldFill` / `fieldInvalidFill` per Variant, `fieldHover`, `fieldInvalid`, `fieldRoot` (8px gap + whole-field disabled), `fieldLabel(invalid)` (Body/MD/700 `text/secondary` → `text/accent` on focus), `fieldHelper` / `fieldError` (Caption/300). `fieldSurface` kept for the pickers.
2. Input / Bottom Line: frame + bare input; `leadingIcon` / `trailingIcon`; Input `variant`; Bottom Line Padding X 12.
3. Textarea: `bg/surface`, `focusBorder`, error fill.
4. Stepper: `Field.Root` + label association, SVG ± icons, per-size title, error fill, hugging number input, Pressed stroke.
5. SelectInput: `focusBorder` (no outset ring), `variant`, `leadingIcon`, muted placeholder, `border/accent` while open.
6. Multiselect: `size`, `variant`, `disabled`, Badge chips, chevron trigger, `border/accent` while open.
7. All fields: inside-stroke padding (exact 40/44/56 heights), 8px Items Gap, full error colours, whole-field disabled.
8. DatePicker + TimePicker triggers: `focusBorder` (Date dropped the outset ring), hover, `status/danger/border` when invalid.
9. `focusRingInset` removed; contrast-audit text-field pairings.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (all 6 + Date/Time Picker ✓), contrast (16 / 27, 25 findings, no new ones), biome. Playwright light + dark of every story; computed styles for rest / hover / Tab-focus on all six (border colour, 2px focus shadow, label colour + size), error fill/border, disabled opacity 0.4 on the field wrapper, measured heights.

## For the designer (→ PROGRESS.md)
- Remove the hidden 1px `.Focus-ring` instances from every Input frame; focus = the frame's own stroke → `border/focus` 2px (hybrid model).
- Hover/Pressed state layers: Base/Bottom Line use `overlay/state layer` at **40% (bound to `opacity/disabled`) / 70% (`opacity/overlay`)**, a heavy wash; Textarea 20% / 35% (`opacity/hover` / `pressed`); Select/Multiselect `overlay/default black@0.20` (not mode-aware). React ships hover = `border/hover` only. Align the masters.
- "Active" on Base/Bottom Line/Textarea is the typing state; it overlaps the `Focused` boolean. Pick one.
- Placeholder styles: S/M **Caption/700** (bold), L Body/MD/700, Textarea Caption/300. React uses 12/14/16 regular; confirm the intent.
- Bottom Line wrapper Items Gap is bound to the old `--- Atoms ---/--- Input/Inner-gap/Input-inner-gap` token (`---` = wrong); its Size S/M padding token is `Padding`, Size L `Padding X`.
- Textarea tokens: only Size L has `Items Gap`.
- Stepper title scales per size (Caption/700 → Body/MD/700) while every other input uses Body/MD/700; the `0` number is `text/muted`.
- Stepper/Textarea Disabled opacity binds `opacity/disabled`, the others `- opacity -/disabled`. Check whether these are two variables.
- Select/Multiselect wrappers model Disabled as a **State value**; the other inputs use a `Disabled` variant property. Multiselect has an `Expanded` variant with a single option (Off).
- Multiselect chips mix a Badge Outline and a Badge Default; pick one (React uses Default).
- Secondary Variant exists only on Base/Select/Multiselect.
- Placeholder/helper text boxes are 9px tall (text-box artifact); the Multiselect frame reads 45px for the same reason (54px real).
