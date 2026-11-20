# Audit — Pagination page (Phase 4.5)

- **Figma page:** Pagination `2074:11130`, Max Core file `sX5tikviuBEhNbu2iPVya5` (doc frame `7268:41`)
- **Masters:** Pagination `2550:6528` (COMPONENT, no props: prev + 5 numbers + next, Buttons Gap 4); `.Pagination Button` `2550:6444` (State Default/Hover/Pressed/Active × Disabled Off/On, Focused BOOLEAN); `.Pagination Content` `2550:6429` (Type Number/Icon, Page text, Icon swap)
- **React:** `Pagination` (controlled `page` / `count` / `onPageChange`, `siblings`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads of the three masters, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Pagination

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ The master is a fixed row of buttons; React derives it from `page` / `count` (pure-controlled, by the controllable-state convention). Number / Icon content → page buttons + prev / next. `siblings` and the ellipsis are React-only [deviation, kept: needed for real page counts]. |
| 2 | States | ❌ Hover was `bg/subtle` + `text/secondary` (3.86 light, the known finding). Figma Hover = `overlay/hover` + `text/accent` (3.15 light / 3.96 dark) → **Decision:** `bg/subtle` + `text/accent` (5.10 / 5.19), skipped on the current page [code]. ❌ Pressed had no styling → **[code]** Figma's `overlay/pressed` + `text/on-accent` (1.91 dark, the dark accent ramp). The hover rule outranked `active:` in the CSS order → hover is now `not-active:`. ✅ Active `accent/subtle` + `text/accent`, border stays `border/default`. ✅ Disabled = `opacity/disabled`. |
| 3 | Colours | ✅ `bg/default` + `border/default`, label and chevrons `text/secondary`. |
| 4 | Dimensions | ✅ Min Width 24 / Icon Size 24 / Button Padding 4 / Gap 4 / Radius sm / Border Weight thin. ❌ Prev / next were 34 wide: the CSS border adds to the 4px padding, while Figma's stroke is inside → **[code]** padding `calc(spacing-04 − border-weight-thin)`, every button 32 × 32. |
| 5 | Typography | ✅ Body/SM/700 = `text-sm font-bold`. |
| 6 | Anatomy | ✅ prev · pages · next. ❌ The ellipsis slot was narrower than a button, so the bar changed width while paging → **[code]** a 32px slot. |
| 7 | Focus | ✅ React `focusRing`. Figma: ad-hoc `Focus` rectangle (37 × 37, `border/accent` 1px, radius bound to `Atoms/Buttons/Standard Button/S/Radius`) on a Focused BOOLEAN → `.Focus-ring` [designer]. |
| 8 | A11y | ✅ `nav aria-label="Pagination"`, `aria-current="page"`, labelled prev / next, disabled at the ends. ❌ **Bug:** the range pushed page 2 twice on page 3 (and `count − 1` twice near the end) → duplicate React keys left a stale "2" button in the DOM ("1 2 … 6 7 8 … 42") → **[code]** standard constant-length window (always `siblings × 2 + 5` slots: `1 2 3 4 5 … 42`, `1 … 5 6 7 … 42`, `1 … 38 39 40 41 42`). Contrast: hover finding gone; pressed dark 1.91 enters (dark ramp). |
| 9 | Doc page | ✅ 6 tokens match. `.Pagination Content` master variants stroke `border/accent`; every instance overrides it to `border/default` [designer]. |
| 10 | Story | ✅ Default (10 pages) + ManyPages (42). |

## Code fixes applied
1. Hover `bg/subtle` + `text/accent` (not on the current page, not while pressed); pressed `overlay/pressed` + `text/on-accent`.
2. Inside-stroke padding → every button 32 × 32; ellipsis in a 32px slot.
3. `paginationRange` rewritten (duplicate-key bug; constant length).
4. `contrast-audit.ts`: Tabs pressed pairing declared (missed on the Tabs page). _Range page follow-up:_ the real cause was an apostrophe in a comment misaligning the extractor; fixed there, and the manual entry removed.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast 30 findings / 19 of 30 (but see the Range page: the final comment edit hid Pagination from the audit until the extractor fix) (Pagination: hover 3.86 gone, pressed dark 1.91 in; Tabs pressed dark 1.91 declared). Playwright light + dark, clicked through: hover `bg/subtle` + `text/accent`, none on the current page; pressed `overlay/pressed` + white; next ×5 → `1 … 6 7 8 … 42`; last → `1 … 38 39 40 41 42` with next disabled; paging 4 → 5 → 6 keeps the bar at 320px; keyboard focus ring visible.

## For the designer (→ PROGRESS.md)
- Hover `overlay/hover` + `text/accent` fails AA (3.15 light / 3.96 dark); React uses `bg/subtle` + `text/accent`.
- Pressed `overlay/pressed` + white = 1.91 dark (dark accent ramp).
- Focus: ad-hoc `Focus` rectangle (1px `border/accent`, radius bound to the Standard Button S token) → `.Focus-ring`.
- `.Pagination Content` masters stroke `border/accent`, overridden to `border/default` in every instance.
- No ellipsis item for long page ranges (React adds one, `text/muted`, in a 32px slot).
