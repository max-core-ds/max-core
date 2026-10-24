# Audit — Time picker page (Phase 4.5)

- **Figma page:** Time picker `2094:3643` (doc frame `7182:27`), working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Time Picker `2166:40`, a standalone COMPONENT (no properties): Container → Selector bar + Hour / Minutes / Period columns
- **React:** `TimePicker` (`mode` inline | popover; `time.ts` helpers)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads, a master screenshot and doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ The master has no properties (a static 4 : 10 PM frame). **[deviation]** All React props are behaviour Figma can't express: `value`/`defaultValue`/`onValueChange` (canonical 24h strings), `format` 12h/24h, `showSeconds`, `minuteStep`/`secondStep`, `minTime`/`maxTime`/`disabledTimes`, and `mode="popover"` with a field trigger (`label`/`helper`/`errorMessage`/`placeholder`/`clearable`). |
| 2 | States | n/a in Figma. React adds blocked options (`disabled:opacity-30`) and `disabled` (`opacity/disabled` on the surface) **[deviation]**. **Hover (user request, not in Figma):** a non-selected, enabled row turns `text/accent` at full opacity (6.29 light / 7.34 dark on `bg/surface`), so it lights up without looking selected (no bar, no bold). `accent/hover` was rejected because it's a pale fill token (about 2:1 as text). The designer should add a hover spec. |
| 3 | Colours | ❌ **The wheel was off-master:** a solid `accent/default` bar with `text/on-accent` white centre text. Figma: **Selector `accent/subtle`, centre value `accent/default`** → **[code]** now matches. **User decision:** keep Figma's `accent/default` centre even though it fails dark AA (3.33; light 5.10) → designer list + contrast override. The old white-on-solid bar failed dark worse (2.85) but was untracked. ✅ ±1 `text/secondary` @ `opacity/dim`, ±2 @ `opacity/disabled`; Container `bg/surface`. ❌ The Figma **unselected period (AM) is bound to `accent/subtle`** (1.23 light / 1.47 dark, invisible) → **user decision:** it follows the ±1 neighbours (`text/secondary` @ dim); flagged to the designer as a likely mistake. |
| 4 | Dimensions | ✅ Radius `l`, Border Weight none, Container Padding 24/16, Gap 16. ❌ **Items Gap (16) was ignored:** React used fixed 44px rows and 64px-wide columns (surface about 272×252). Figma: rows stacked with a 16px gap and hug-width columns → **[code]** rows are line-height tall (16/20/24 → `--size-16/20/24`) with `gap-[--spacing-16]`; columns hug (`min-w-[2ch]` so a 12h hour column doesn't narrow when every visible hour is one digit). Selector bar is 24 tall, full-bleed. Measured: surface 150×192, bar at y 84 = centre row. Figma's frame reads 135×146 only because of the stuck-text-box artifact (rows 9–12px tall) → [designer]. ❌ `Period Bottom Padding` (28) is defined and documented but bound nowhere in the master → [designer]. |
| 5 | Typography | ❌ React: centre 18px bold, ±1 15px, ±2 14px, normal weight. Figma: **centre Body/MD/700, ±1 Body/SM/300, ±2 Caption/300** → **[code]** `text-base font-bold` / `text-sm font-light` / `text-xs font-light`. The Period spacer texts have no text style (Inter Light 12/14, transparent) → [designer] nit. |
| 6 | Anatomy | ✅ Selector bar behind Hour · Minute · (Second) · (AM/PM) columns, 5 rows each; short lists (AM/PM, coarse steps) centre the selection and pad with blanks, like the Figma Period spacers. |
| 7 | Focus | Figma: none. React: **[code]** wheel columns (listboxes) used an inline −2px outline → shared `focusRing` (outset, keyboard-only, `radius-sm`). The **popover trigger is a bordered field** → hybrid model `focusBorder` (border → `border/focus` 2px) instead of the outset `focusRing` (first use of `focusBorder`; the Inputs page rolls it out to the rest). Playwright: both visible on Tab, light and dark. |
| 8 | A11y | ✅ Columns are `role="listbox"` with `option`/`aria-selected` rows; ↑/↓ step, ←/→ move between columns, mouse wheel ±1; the trigger is labelled via `label`/`aria-label`; errors go through `Field.Error`. Contrast: TimePicker now enters the audit via an `OVERRIDES.extra` pairing (the selected row on the separate bar element), **25 findings / 16 of 24** (was 24 / 15 of 23; a coverage gain). The faded ±1/±2 rows (2.3 / 1.7 light) are the master's deliberate distance fade, not asserted. |
| 9 | Doc page | ✅ The structure, colour list and 7 tokens match. ❌ "Period Bottom Padding → period column bottom spacing" describes a token the master doesn't bind; the doc says "Container … border/default stroke" (the weight is none, so nothing renders) → [designer]. |
| 10 | Story | ✅ Controls cover mode/format/step/seconds/clearable/disabled; Popover, Inline, WithError, WithSeconds and Constrained each show a configuration Controls alone can't set up (values, bounds). |

## Code fixes applied
1. Selector bar `accent-default` → `accent-subtle`; centre value `text/on-accent` → `accent/default` (Figma, by decision).
2. Row typography Body/MD/700 · Body/SM/300 · Caption/300; row heights = line heights; Items Gap 16; hug columns (`min-w-[2ch]`). The `--tp-row` custom property is removed.
3. Unselected AM/PM follows the ±1 neighbour treatment (by decision).
4. Focus: columns → shared `focusRing`; popover trigger → `focusBorder` (hybrid model).
5. Hover on non-selected rows: `text/accent` + full opacity (user request).
6. `contrast-audit.ts`: TimePicker selected-row pairing declared (`accent/default` on `accent/subtle`).

**Contrast baseline:** **25 findings / 16 of 24 components** (TimePicker added; dark 3.33, kept by decision).
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Time Picker ✓). Playwright light + dark: Inline, WithSeconds, Constrained, column focus, trigger focus, open popover; bar/centre geometry measured.

## For the designer (→ PROGRESS.md)
- The centre value `accent/default` on the `accent/subtle` selector is 3.33:1 in dark (fails AA for 16px bold). Shipped as-is; fix it in the dark accent ramp or use `text/accent`.
- The unselected period (AM) is bound to `accent/subtle` (about 1.2:1); React uses `text/secondary` @ dim like the other columns.
- Row text boxes are stuck at 9–12px high, so the frame reads 135×146 instead of about 150×192.
- `Period Bottom Padding` (28) is documented but bound nowhere; Period spacer texts have no text style.
- React added a row hover (`text/accent`, full opacity); add a matching Hover spec to the master.
