# Audit — Dropdown page (Phase 4.5)

- **Figma page:** Dropdown `127:1526`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Dropdown `2380:9128` (standalone COMPONENT: `Trigger` INSTANCE_SWAP, default Entity Card, 7 preferred values; `Active` BOOLEAN)
- **React:** `Dropdown` (Base UI Menu); its popup (`DropdownMenu`, internal) is now shared with `SplitButton`'s chevron menu
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads of the master, a master screenshot, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Dropdown

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Trigger swap → `trigger` (any element). ❌ **Active** had no prop (the menu was uncontrolled only) → **[code]** `open` / `defaultOpen` / `onOpenChange`, passed to `Menu.Root`. ✅ Items: leading icon + label (+ `disabled`), as the master's List Items (Show Leading on, support text / trailing off). |
| 2 | States | n/a on the container; rows carry the List Item states (highlighted = hover wash, pressed = `accent/active`, disabled = opacity). |
| 3 | Colours | ❌ The popup was a custom menu: `border/muted`, `shadow/down/md`, highlight `bg/subtle` → **[code]** the master's **Item List** (`bg/surface` + `border/default`, **no shadow**) with List Item rows (`accent/subtle` highlight), via `ItemList` + `listItemOption`. Same as the Select popup. |
| 4 | Dimensions | ✅ Gap (trigger ↔ list) 4 = `-- Molecule/Dropdown/Gap` → `sideOffset={4}`. ❌ Popup radius md / rows 6·8 padding, radius sm → **[code]** Item List radius sm, rows 12 padding, radius l, 44px with 20px icons. ❌ **Item List Padding** (4) is bound on the **left only**: the list is 228 under a 232 trigger, flush right. **Decision:** the list is at least as wide as the trigger and starts at its left edge (`min-w: --anchor-width`), the padding reads as a slip → [designer]. Height capped to `--available-height`; the ScrollBar rail shows when it overflows (Show ScrollBar on in the master). |
| 5 | Typography | ❌ Rows were `text-sm` regular → **[code]** Caption/700 (List Item). |
| 6 | Anatomy | ✅ Trigger → Item List (no search / Select all / divider, ScrollBar on) → List Item rows. Item List keeps the React deviations from the Item List page (4px row gap + inset, fade). |
| 7 | Focus | ✅ The trigger keeps its own focus ring; menu rows move `data-highlighted` (no ring), as listbox options. |
| 8 | A11y | ✅ Base UI Menu: `role=menu` / `menuitem`, arrow keys, Escape, typeahead. |
| 9 | Doc page | Says 3 tokens: Gap, Item List Padding, `zIndex/dropdown` (400, direct value). `zIndex/dropdown` isn't in the export; React popups have no z-index (portal order) → [designer] check the export if stacking matters. |
| 10 | Story | ✅ Default; `open` / `defaultOpen` show up in Controls. |

## SplitButton menu (follow-up)

**Decision (user):** SplitButton's chevron menu used the same old custom menu → it now renders `DropdownMenu` (end-aligned, anchored to the **whole** split button, so the list is at least as wide as it). `SplitMenuItem` is now an alias of `DropdownItem` (same shape).

## Code fixes applied
1. `Dropdown`: popup = `ItemList` + `listItemOption` rows (20px icons), no shadow, `min-w: --anchor-width`, `max-h: --available-height`; `open` / `defaultOpen` / `onOpenChange`.
2. `DropdownMenu` (internal) shared with `SplitButton` (anchor = the container).
3. `drift.ts`: Dropdown exempts `--spacing-04` (Gap is the numeric `sideOffset`; Item List Padding not applied by decision).

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast (unchanged: 17 / 28). Playwright light + dark: Dropdown list at trigger bottom + 4, left-aligned, 126 ≥ 72 trigger; SplitButton list right edge = button right edge; rows 44px, 12px/700, hover `accent/subtle`, border `border/default`, radius 4, no shadow.

## For the designer (→ PROGRESS.md)
- `-- Molecule/Dropdown/Item List Padding` is bound on the left of the list container only (the list is 4px narrower than the trigger, flush right). React aligns the list with the trigger.
- `zIndex/dropdown` (doc page) isn't exported as a variable.
- The trigger's 7 preferred values can't be resolved from the Max Core file (library keys).
