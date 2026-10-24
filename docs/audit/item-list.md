# Audit — Item List page (Phase 4.5)

- **Figma page:** Item List `2330:6702`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Item List `2344:4399` (standalone COMPONENT + Slot). Also used by the Select Input / Multi-Select Input wrappers' `State=Active` (`2316:1293`, `2316:2233`).
- **React:** `ItemList`; now also the popup of `SelectInput` and `Multiselect mode="list"` (carry-overs from the Inputs page)
- **Audited:** 2026-10-24, via read-only `use_figma` reads of the master, the Active states of Select / Multiselect, and the doc-page text. `ItemList` itself was rebuilt to the master on 2026-10-23 (`4941d6f`); this pass re-confirms it.

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## ItemList

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Show search / Show Select all / Show Divider / Show ScrollBar / Slot → `search` / `selectAll` / `showDivider` / `showScrollBar` / `children`. |
| 2 | States | n/a on the container; rows carry the List Item states. |
| 3 | Colours | ✅ `bg/surface` + `border/default` (INSIDE). Doc page says `bg/elevated` / `border/muted` → [designer] (already listed). |
| 4 | Dimensions | ✅ Radius sm, Border Weight thin, Container Padding Y 12, Search Padding X 12, Min Width 120; rows flush (item spacing 0); Select all row 40 (12 + 16 checkbox + 12), label at 36 (gap 8). ✅ Slot rows are 228 in a 240 list: the ScrollBar sits beside them (React's ScrollArea external rail). `-- Molecule/Item List/Gap` (8) is bound nowhere → [designer] orphan. `Divider Stroke` isn't bound on the Divider instance → [designer]. |
| 5 | Typography | ✅ Select all + rows Caption/700 `text/primary`. "Sellect all" typo → [designer]. |
| 6 | Anatomy | ✅ Search Container → Select all List Item (Checkbox S) → Divider → Slot → absolute ScrollBar. |
| 7 | Focus | ✅ SearchBar `focusBorder`, Checkbox `focusRing`, rows `focusRing` (ListItem). |
| 8 | A11y | ✅ Select all is a `<label>` around the Checkbox (no nested interactive). |
| 9 | Doc page | Stale colours; "Sellect all". |
| 10 | Story | ✅ Default (all features, filtering + select all), ItemsOnly. |

### Follow-up: requested deviations (user, 2026-10-24)
Even though ItemList matched the master, three usability fixes were requested:
- **Row gap:** rows are 4px apart (`spacing-04`); the master stacks them flush. `-- Molecule/Item List/Gap` (8) is unbound in Figma; bind it if the designer wants a gap there.
- **Side inset:** the scroll content (and the Select all row, to keep the checkbox aligned with the row icons) sits 4px in from the container sides, so selected/hover fills no longer touch the left border.
- **Clipping + padding:** the options area has an even 4px padding on every side, inside the scroll content, so rows scroll right down to the border instead of being cut on a hard line above it (the padding shows at the end of the scroll). Container Padding Y (12) now only tops the header (search / Select all); a header-less list (the Select popup) is 4px top and bottom. While more rows sit below, the viewport fades its last 24px (`mask-image`). `ScrollArea` gained `viewportClassName` + `data-overflow-start` / `data-overflow-end` on the viewport to drive it.

These apply to the Select / Multiselect popups too (they render ItemList). Verified: rows 218 wide at x+5 (border + 4); Select popup first row at list top + 5, last row 4px above the border; the fade at the top of the scroll, gone at the end.

## Select / Multiselect popups (carry-over)

The masters' `State=Active` open an **Item List** 8px below the field (`-- Molecule/Input/Global/General/Items Gap`), as wide as it, **no shadow**:
- **Select:** search / Select all / divider off, ScrollBar on; rows = List Items with a leading **Radio S**.
- **Multiselect:** everything on; rows = List Items with a leading **Checkbox S** (checked = the check mark only, no row fill). The field shows chips only.

| # | Finding → fix |
|---|---|
| 1 | ❌ Select popup was a plain menu (4px inset, trailing ✓, `radius/md`, shadow md) → **[code]** renders `ItemList` (no header), rows `listItemOption` + leading `RadioMark`; `sideOffset` 8. **Decision:** no shadow, as the master. |
| 2 | ❌ Multiselect had no Figma version → **[code]** `mode="list"` (decision: keep both, default `typeahead`). The field becomes a `Combobox.Trigger` showing chips (no remove ×: the checkboxes deselect) + placeholder + chevron; the popup is an `ItemList` with a SearchBar (rendering `Combobox.Input`, focused on open), a Select all row that acts on the **visible** rows (checked / indeterminate), and `CheckboxMark` rows; "No matches" when the filter empties it. New `searchPlaceholder` prop. **Decision:** the typeahead version keeps its plain menu. |
| 3 | New internals: `listItemOption` (ListItem.tsx; List Item row look for listbox options, highlighted = hover wash, pressed = `accent/active`), `CheckboxMark` / `RadioMark` (visual-only S marks following the row's `data-selected`). Not exported from the package. |
| 4 | ❌ **Select showed the raw value** (`ro`, not "Romania") once chosen: `Select.Root` had no `items` → **[code]** passes `items`. |
| 5 | ❌ While open, hovering the Select trigger showed `border/hover` instead of `border/accent` → **[code]** `fieldHover` skips `data-[popup-open]`. |

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (all ✓), biome, contrast. Playwright light + dark: Select list at trigger bottom + 8, same width, 40px rows, radio dot on the chosen row, label shown in the trigger, `border/accent` while open; Multiselect list mode: label associated with the trigger, search focused on open, filter "s" → 2 rows, Select all adds only the visible rows, chips update. The typeahead Multiselect is unchanged.

**Contrast:** ListItem now enters the audit (28 components): its selected (`text/on-accent` on `accent/default`, dark 2.85) and pressed (`accent/active`, dark 1.91) rows fail in dark. These are the existing dark accent-ramp findings (Figma-side), newly detected rather than new. **17 / 28 components, 27 findings.**

## For the designer (→ PROGRESS.md)
- React deviates on purpose: 4px row gap, 4px side inset, bottom padding inside the scroll + fade while more rows remain. Consider adopting these in the master (bind the unused `Item List/Gap`).
- "Sellect all" typo in the master's Select all row.
- `-- Molecule/Item List/Gap` (8) is bound nowhere; `Divider Stroke` isn't bound on the Divider instance.
- Select / Multiselect Active: the floating Item List has no shadow (React follows). Decide whether a floating list should lift.
- Multiselect Active's Item List is absolute at y 69 (≈4px below the field), Select's sits in the flow at Items Gap 8. React uses 8 for both.
