# Audit — Date picker page (Phase 4.5)

- **Figma page:** Date picker `2070:9816`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** `_Day Item` `2070:11287` (19 variants: Range None/Today/Start/End/Middle/Active × State Default/Hover/Pressed × Disabled), `_Weekday Header` `2070:11504`, Calendar Pane `2472:2567` (Month / Month Year), `_Date Picker Footer` `2070:11651`, Date Picker `2486:6242` (Type Date/Month/Year Picker; Show Footer, Show 6th row), Dual Date Picker `2499:12472`, Input Date Picker `2499:14039`
- **React:** `DatePicker`, `DualDatePicker`, `DateInput` (react-day-picker restyled; see memory `project-datepicker-react-build`)
- **Audited:** 2026-10-24, via read-only `use_figma` reads of every master (bindings, nested variants, icon fills), master screenshots, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## DatePicker / DualDatePicker

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Type Date / Month / Year Picker → `granularity`; Show Footer → `showFooter`; Show 6th row = automatic (rdp renders the weeks the month needs). Day price label (`day price` + Price Label) not built (YAGNI). |
| 2 | States | ❌ Day **Hover** was the state-layer overlay. Figma = `accent/hover` + `text/on-accent`, which is **1.91:1 in light** → **Decision:** the List Item wash (`accent/subtle` + `text/primary`); the selected fill ignores hover → [deviation]. ❌ **Pressed** → **[code]** `accent/active` + `text/on-accent` (as Figma; dark 1.91, flagged). ✅ Selected `accent/default`. Disabled = opacity. |
| 3 | Colours | ❌ **Today** was a `border/accent` ring with default text → **[code]** 1px `accent/default` circle + `text/accent`. ❌ **Range middle** text was `text/primary` → **[code]** `text/accent` on the `accent/surface` band. ❌ Weekdays `text/muted` → **[code]** `text/secondary`. ❌ Header icons (chevrons, prev / next) → **[code]** `text/secondary`, as the master. |
| 4 | Dimensions | ❌ The pane had 16px padding all round with an 8px gap between week rows → **[code]** no pane padding, edge-to-edge grid: header 16·12 (Header Padding X/Y), rows flush at 44 (Day Item Padding 2 + 40), columns share the width, footer 12 all round. Measured 308 × 368 = 56 + 36 + 5 × 44 + 56. ❌ The range was a set of separate 40px squares → **[code]** start → middle → end is one continuous band (range cells drop the joining padding; start rounded left, end rounded right). Dual: months 8px apart. |
| 5 | Typography | ❌ Days `text-sm` regular → **[code]** Caption/700. ❌ Weekdays 12/500 "Mo" → **[code]** Caption/300 "Mon" (short weekday). ❌ Header labels `text-sm` bold → **[code]** ghost Button S (Caption/700). |
| 6 | Anatomy | ❌ Header used hand-rolled text and nav buttons → **[code]** month + year as ghost **Button S** with a chevron each (**decision:** keep both buttons for the drill-down; the master shows the month only) + ghost **Icon Only S** prev / next, 8px apart. ❌ **Outside days** were shown muted → **Decision:** blank, as the master. ❌ Footer buttons were size M → **[code]** S (32), sharing the width (the Action Bar's 160 minimum lifted). Month / Year pickers are wheels in Figma (Time Picker); React keeps the grid (known, deferred), restyled to the day look. |
| 7 | Focus | ❌ Days, grid cells and nav used ad-hoc `ring-2` → **[code]** shared `focusRing`; nav / labels get it from IconOnlyButton / Button. |
| 8 | A11y | ✅ rdp grid keyboard nav; nav buttons labelled. |
| 9 | Doc page | See designer list. |
| 10 | Story | ✅ Default, granularities, footer, constrained, disabled dates, range, input, input error. |

### Follow-up (user report, 2026-10-24)
- **Squeezed columns:** once range cells stretched to fill their column, a month that was mostly in range lost its minimum width and the grid collapsed. → each month has `min-w-[308px]` (One Calendar Min Width).
- **Range kept growing:** after paging months, a click before the start stretched the old range back to the clicked day (react-day-picker's default), banding whole months. → a click after a finished range starts a new range (start = the clicked day, no end).

## DateInput (Input Date Picker)

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Base Input + Date Picker. ❌ No `size` → **[code]** `size` S/M/L (Base Input S/M/L tokens; default M like the other fields, the master shows S) + the FormGroup size context. |
| 2 | States | ❌ Hand-rolled trigger → **[code]** the shared field model (as Select): `fieldBorder` (`focusBorder`), `fieldHover`, open = `border/accent`, Error fill + border, whole-field disabled. |
| 3 | Colours | ✅ Calendar icon `text/muted`. ❌ Label `text-sm` `text/secondary`, helper `text/muted` 12 → **[code]** `fieldLabel()` / `fieldHelper` / `fieldError`. |
| 4 | Dimensions | ❌ Fixed 240 wide → **[code]** fills its container (min 160/180/200 per size), heights 40/44/56. ❌ Popup 8px below with shadow md → **[code]** 12px (Input Date Picker Gap), no shadow, at least as wide as the field (min 308). **Decision:** the pane gets a 1px `border/default` in the popup (the master has none; white on near-white in light) → [deviation]. |
| 5 | Typography | Value 12/14/16 regular, as the other fields (the master's Caption/700 value is the Inputs-page deviation). |
| 6–8 | Anatomy / Focus / A11y | ✅ Leading calendar, trailing clear ✕ (now `focusRing`, sized per field); label associated with the trigger. |

**Contrast:** day colours are conditional classes the extractor can't see, so `contrast-audit.ts` declares weekday, today, hover and range-middle (all pass). Selected / pressed (`on-accent` on `accent/default` 2.85 dark, `accent/active` 1.91 dark) are extracted from the month/year grid's literals: the known dark accent ramp, Figma-side. The old `text/muted` on `bg/subtle` nav-hover finding is gone. **27 findings / 17 of 29 components.**

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast. Playwright light + dark: Default, Range, WithFooter, Input open, hover, keyboard focus. Measured pane 308 × 368, rows 44, days 40 × 40 at 12/700, weekday 12/300 `text/secondary` "Mon", header buttons 32 tall (labels `text/primary`, icons `text/secondary`), footer buttons 138 × 32, hover `accent/subtle` + `text/primary`.

## For the designer (→ PROGRESS.md)
- Day **Hover** `accent/hover` + `text/on-accent` = 1.91:1 in light; React uses the List Item wash. **Pressed** `accent/active` + white = 1.91 dark. Range **Middle Hover** keeps `text/accent` on `accent/hover`; **Middle Pressed** is bound to `overlay/hover` (band) + `overlay/pressed` (text), which looks like a slip.
- The blank leading/trailing cells are `_Day Item Range=Today, Disabled=on` instances (an empty variant used as a spacer); name it, or use a spacer.
- `Footer/Padding X` (16) and `Footer/Padding Y` (12) are unbound: the footer renders 12 all round (React follows the render).
- `_Weekday Header` text box is stuck at 9px (row renders 29 instead of ~36), the same artifact as Badge / Segmented.
- The Input Date Picker's pane has no border or shadow, so in light it floats white on near-white; React adds `border/default`.
- The header shows the month only; React shows month + year buttons (drill-down).
