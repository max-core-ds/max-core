# Audit — Stacked List page (Phase 4.5)

- **Figma page:** Stacked List `2080:11622`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Stacked List `2080:23144` (COMPONENT_SET: `Type` Default / Social / Ride row / Delivery row / Media row / Product / Booking / Items grid / Transport; text, boolean and swap props per type; `Items Slot`) · `_Share Item` `2087:7987` (`Type` Item / Avatar / Danger / Warning / Success; `Title`, `Icon instance`) · internals (`_Image Placeholder`, `_Social Avatar Group`, `_Media Action`, `_Ride Avatar`, `_Transport Image`, pay logos …)
- **React:** `StackedList` + `StackedListRow` (`variant` default / social / media / product) · `ShareItem` (`tone`, `icon`, `avatar`, `label`)
- **Scope:** the four built row types + Share Item. Ride / Delivery / Booking / Items grid / Transport rows stay **deferred** (PROGRESS → Deferred); Items grid is covered by laying `ShareItem`s out in a row.
- **Audited:** 2026-10-25, via read-only `use_figma` reads of the set (props, the four built variants' anatomy, bindings, icon / button variants), `_Share Item`, the doc page and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Type → `variant`; Title / Subtitle → `title` / `subtitle`; Show … booleans = omit the node; left / right / trailing swaps → `leading` / `trailing`. ❌ Social's sub icon (Show sub icon, 12px chevron) had no place → **[code]** `subtitleIcon`. ❌ Product's Price (H6 under the subtitle) had no place; the story put it in `trailing` → **[code]** `price`. ✅ Share Item: Type Item / Danger / Warning / Success → `tone`, Avatar → `avatar`. |
| 2 | States | n/a in the master (no row states). Clickable rows (`onClick`) keep hover `bg/subtle` as a React extension. |
| 3 | Colours | ✅ Row `bg/surface`; title `text/primary`; subtitle `text/secondary`; price `text/accent`. ❌ Default's leading icon inherited `text/primary`; master `text/secondary` → **[code]**. ❌ `StackedList` defaulted to a bordered card with `border/muted` dividers; the master is rows only, stroke weight **none**, stacked edge to edge → **[code]** `bordered` / `divided` default **false** (kept as opt-in extensions); each row carries its own `bg/surface`. ✅ Share Item fills / icons / labels per tone. |
| 4 | Dimensions | ✅ Padding 16 / 12, Gap 16, Inner Gap 8, leading 32 (Default / Social) and 56 (Media / Product), icon 24, Share Item tile 48 / icon 28 / radius full. **[deviation]** Media's placeholder renders square (radius 0, unbound) while its `Item Radius` token is `sm` → React keeps the token. Heights 70 / 80 / 104 vs 56 / 80 / 80 are the open cap-trim sweep. |
| 5 | Typography | ❌ Title `font-bold` at the default line-height → **Body/MD/700** (16 / 140%) → **[code]**. ❌ Subtitle `text-sm` regular → **Caption/300** → **[code]**. ❌ Price → **Heading/H6** (20 / 130% / −0.5%) → **[code]**. ❌ Share Item label missing Caption/700's 130% / +0.5% → **[code]**. |
| 6 | Anatomy | ✅ leading · text column (title, subtitle row, price) · trailing. Default / Social trailing = Icon Only **Ghost S** chevron-right; Media `li:equal` `text/secondary`; Product `li:trash` `status/danger` → story. |
| 7 | Focus | ❌ Clickable row: a bare `ring-2` with no offset, hidden under the next row → **[code]** shared `focusRing`, lifted (`z-10`) over its neighbours. ❌ `ShareItem` (a button) had no focus style → **[code]** `focusRing` (radius sm). |
| 8 | A11y | ✅ Rows are `div`s, or `button`s with `onClick`; Share Item a `button`. Contrast: StackedList ✓; Share Item Default `accent/default` on `accent/subtle` 3.33 dark (existing, kept as Figma). Unchanged 31 / 19 of 31. |
| 9 | Doc page | Header says "MAX CORE · MOLECULES" (Organisms page). Doc lists `-- Atoms/List Item/*` tokens the rows don't use. Copy typos: "arive", "ariving", "Budapesta", "Vehicule". |
| 10 | Story | ❌ Invented content (Profile / Billing rows, AvatarGroup, Badge, Link Buttons, price as trailing) → **[code]** master content per type (Settings / Your story / Where the dog's at / Iphone 17 pro) + an `Interactive` story for clickable rows; `bordered` / `divided` on Controls. |

## Code fixes applied
1. `StackedList`: no card frame / dividers by default (opt-in); rows own `bg/surface`.
2. Row typography Body/MD/700 · Caption/300 · H6 price; Default leading icon `text/secondary`.
3. New `subtitleIcon` and `price`.
4. Clickable rows + `ShareItem` on the shared `focusRing`; Share Item label Caption/700 metrics.
5. Stories on the master's content.

**Breaking-ish:** `StackedList` now renders without a border / dividers unless `bordered` / `divided` are set.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (31 / 19 of 31). Playwright (light + dark): rows 375 wide, no border, `bg/surface`; leading 32 / 56 (radius 4 on media / product); title 16 / 22.4 / 700, subtitle 12 / 15.6 / 300 / 0.06px `text/secondary`, price 20 / 26 / 700 / −0.1px `text/accent`; Default icon `text/secondary`; Share Item tile 48, icon 28, label 12 / 15.6 / 700; Tab → full ring on the focused row and on a Share Item.

## For the designer (→ PROGRESS.md)
- Rows carry a `border/default` stroke at weight 0 (dead stroke).
- Media row placeholder radius 0 while `Media Row/Item Radius` (sm) is bound nowhere; Product's 4 is unbound.
- Product trash icon 26 (unbound, off the size scale).
- Default's trailing Icon Only Button binds width to `Social/Icon Size` and height to `Default/Item Size` (cross-variant bindings on an instance).
- `_Share Item` Type mixes the content type (Item / Avatar) with the tone (Danger / Warning / Success).
- Doc: "MOLECULES" tier label; lists List Item tokens; copy typos (arive, ariving, Budapesta, Vehicule).
