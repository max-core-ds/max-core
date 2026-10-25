# Audit — Data table page (Phase 4.5)

- **Figma page:** Data table `2040:1575`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters audited:** Table Builder `2768:2` (Desktop) · `_Header Row` `2044:1561` · `_Header Cell` `2043:3165` + `_Header Cell / Label` `2056:17687` · `_Table Cell` `5092:17952` / `2046:10615` · `_Table Row` `2043:2698` (Default / Hover / Selected) · `_Table Footer` `2050:60145` (Desktop) · `_Cell Item / Rating Group` + `Rating Star` · `_Cell Item / Simple Text`, `.Text-simple`, `Product Info`, `Flags`, `Time Tracker` (content reference)
- **React:** `DataTable` (column config, sort, selection, `header` / `footer` / new `footerInfo`) + primitives `Table` / `HeaderCell` / `TableRow` / `TableCell` + `RatingStars`
- **Scope:** the desktop table. Still **deferred** (PROGRESS → Deferred): Table Builder Mobile (scroll + Button footer), `_Table Row Expanded` (the cell's Show Icon chevron), the `_Table` header content (Title Group, Stats Line / Cards, View Switcher), and the prebuilt tables.
- **Audited:** 2026-10-25, via read-only `use_figma` reads of the masters above and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Body Rows slot → `data` + `columns`; Header Cell Content / Label → `header`; Show Icon (sort) → `sortable`; Row State → `onRowClick` (hover) / `selectedRowId` (Selected); Footer Navigation swap → `footer`. ❌ The footer's `.Text-simple` (left) had no place; the footer was right-aligned only → **[code]** `footerInfo`. `selectable` (checkbox column) is a React extension. Cell items stay caller-composed (stories show Product Info). |
| 2 | States | ✅ Row Hover `bg/subtle`, Selected `accent/subtle`. Sort hover `text/primary` is a React extension. |
| 3 | Colours | ❌ Header cells were `bg/surface`; the master's Header Row is **`bg/default`** → **[code]**. ✅ Header line `border/muted`. ❌ Body cell lines were `border/muted`; master **`border/default`** → **[code]**. ❌ Outer `border/default` frame and a header divider the master doesn't have (Table Builder has no stroke; the header and footer carry the top / bottom radius) → **[code]** removed. ❌ Rating stars were yellow (`status/warning`) filled / outline; master: lucide outline stars in **`text/secondary`**, Full / **Half** / Empty (30% opacity) → **[code]**. ❌ Sort icon was a custom double chevron in the label colour; master `li:chevrons-up-down` 12 **`text/muted`** → **[code]** (inactive half still dims to show direction). |
| 4 | Dimensions | ✅ Header Cell height 40, padding 16 / 8, label gap 4, sort icon 12; Table Cell height 56, padding 16, Min Width 93; footer padding 16, gap 10, footer height 64; radius xl 16. |
| 5 | Typography | ❌ Header label `text-xs` bold **uppercase** tracked → **Body/SM/700**, normal case → **[code]**. ❌ Cell text `text-sm` regular → **Body/MD/300** (Simple Text) → **[code]**. Footer info **Body/SM/300**. |
| 6 | Anatomy | ✅ (header) → header row → body rows → footer (info ⟷ pagination). |
| 7 | Focus | ❌ Sort button had a bare `ring-2` → shared `focusRing` → **[code]**. Row selection checkboxes keep their own focus. |
| 8 | A11y | ✅ `<table>` semantics, `scope="col"`, `aria-sort`, `aria-selected`, sr-only caption, rating `role=img` + label; keyboard sort verified. Contrast: DataTable ✓ (new `text/secondary` on `bg/default` header pair passes); unchanged 31 / 19 of 32. |
| 9 | Doc page | Header Cell `Empty` variant has a value "Empty3". Header Cell Height (40) / Table Cell Height (56) tokens aren't bound on the cells (the cells render 40 / 56 through padding / layout). Rating Empty star opacity 0.3 unbound (no matching opacity token). Two `_Table Cell` sets (`5092:17952`, `2046:10615`) look like duplicates. |
| 10 | Story | ❌ Product cell used an Entity Item with an Avatar; master's Product Info is a thumbnail + Body/SM/700 / Caption/300 → **[code]**; footer shows `footerInfo`; Primitives story drops the border frame. |

## Code fixes applied
1. Shell: no outer border / header divider; header row `bg/default`; body lines `border/default`.
2. Typography: Body/SM/700 header labels (no uppercase), Body/MD/300 cells, Body/SM/300 footer info.
3. Lucide sort icon in `text/muted`; sort button on `focusRing`.
4. `RatingStars`: outline stars in `text/secondary` with half stars and 30% empties.
5. New `footerInfo`; stories on the master's cell content.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (31 / 19 of 32). Playwright (light + dark): shell no border, radius 16; header 40 · `bg/default` · 14 / 18.2 / 700 normal case `text/secondary` · `border/muted`; cells 56 · 16 / 22.4 / 300 · `border/default`; stars `text/secondary`, 4.6 → 4 full + half, 3.9 → 4 + empty at 0.3; footer 64, info left 14 / 300, pagination right; Tab → ring on the sort button, Enter flips `aria-sort`.

## For the designer (→ PROGRESS.md)
- Header Cell `Empty` variant value "Empty3"; two `_Table Cell` sets look duplicated.
- Header Cell Height / Table Cell Height tokens bound nowhere.
- Rating Empty star opacity 0.3 is unbound (no matching opacity token).
- Body cell lines use `border/default` (neutral 500), much darker than the header's `border/muted`; confirm intended.
