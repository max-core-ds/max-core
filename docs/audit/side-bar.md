# Audit — Side bar page (Phase 4.5)

- **Figma page:** Side bar `2011:1382`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Side Bar `2011:2473` (COMPONENT_SET: `Collapsed` off / On; SLOTs `Top Bar`, `Header`, `Sub Header`, `Body`, `Footer`, each with a `Show …` BOOLEAN — Sub Header hidden by default)
- **React:** `SideBar` (`collapsed` / `defaultCollapsed` / `onCollapsedChange`, `topBar` / `header` / `subHeader` / `children` / `footer`) + `SideBarTrigger`
- **Audited:** 2026-10-25, via read-only `use_figma` reads of the set (props, anatomy, bindings, stroke weights + gradient, slot contents, icon fills), the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ 5 slots → `topBar` / `header` / `subHeader` / `children` / `footer`; `Show …` booleans = omit the node; Collapsed → `collapsed` (hybrid controllable, rail context to slotted items). |
| 2 | States | ✅ Expanded / Collapsed. ❌ The toggle was `text/muted` → `text/primary` on hover; master's `li:panel-left` is **`accent/default`** → **[code]** + hover `accent/hover` (the master's toggle is a bare icon with no states). |
| 3 | Colours | ❌ Shell was opaque `bg/surface` + `border/default`; master = **`bg/brand` @ 20%** (no blur) with a 1px **OUTSIDE** stroke, gradient `border/accent` → `border/focus` @ 40% → **[code]** `bg/brand` 20% + a spread shadow ring in `border/focus` 40% (outside, no layout cost). **[deviation]** The gradient ramps ~40% → 97% top to bottom; accent/focus are one palette step apart in light and identical in dark, so it's drawn flat. |
| 4 | Dimensions | ✅ Width 280 / 64, Radius `3xl` 32, Expanded Padding 16, Gap 48, Body items gap 24, Border Weight thin. ❌ Collapsed used the expanded 16 padding + 48 gap; master: **24 top/bottom, 0 sides, gap 16** (bound to `Expanded Padding`) → **[code]**. ❌ Slot insets missing: Top Bar slot **px 16** (Padding) and Footer slot **px 12** → **[code]** wrappers (footer card 248 → 224 expanded, 40 collapsed, as the master). ❌ Toggle icon 20 → **24** → **[code]**. **[deviation]** Collapsed Header / Sub Header also get the 12 inset (master FILLs the 64 rail) so the card's focus ring isn't clipped by the shell. |
| 5 | Typography | n/a (slot content owns its text). |
| 6 | Anatomy | ✅ Top Bar → Header → (Sub Header) → Body (scrolls) → Footer. ❌ Top Bar slot layout was the consumer's: master = row, SPACE_BETWEEN, gap 24 expanded; centred column, gap 24 collapsed (logo over toggle) → **[code]** the rail lays it out. ✅ Collapsed body items centred (44 × 44). |
| 7 | Focus | ✅ Slotted items keep their own `focusRing`; toggle `focusRing`. ❌ The nav's `overflow-y-auto` clipped the full-width items' outset ring → **[code]** 4px negative margin + padding pair on the nav. ❌ Collapsed header card ring clipped by the shell (row 4) → fixed. |
| 8 | A11y | ✅ `<aside>` + `<nav>`; toggle `aria-expanded` + "Collapse / Expand sidebar" label. Contrast unchanged. |
| 9 | Doc page | Doc says "This molecule uses…" (page is Organisms) and names `border/accent` as the border colour (the gradient ends on `border/focus`); doc describes a manual workflow because Figma doesn't persist slot overrides across Collapsed (React's rail context avoids this). |
| 10 | Story | ❌ Header was a bare EntityItem + chevron, footer the same, Sub Header shown by default → **[code]** master content: workspace `Dropdown` with an `EntityCard` trigger, user `EntityCard` footer, no Sub Header; Brand passes logo + trigger and lets the rail lay them out. |

## Code fixes applied
1. Shell: `bg/brand` 20%, outside `border/focus` 40% ring, radius 3xl; collapsed 24 / 0 padding + 16 gap.
2. Rail-owned slot layout: Top Bar slot row / column with px 16; Footer px 12; collapsed Header / Sub Header px 12.
3. Nav keeps room for the items' focus ring.
4. `SideBarTrigger` `accent/default` → `accent/hover`, icon 24.
5. Stories on the master's default content.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright (light + dark): expanded 280 / p16 / gap 48, top bar 248 × 28, header 248 × 56, items 248 × 44 at x16, footer 248; collapsed 64 / 24·0 / gap 16, items 44 × 44 centred (x10); toggle `accent/default` 24 and a click collapses the rail; Tab walk — toggle, header card, items: every ring fully visible in both states.

## For the designer (→ PROGRESS.md)
- Glass differs from the Top Bar: Side Bar has no background blur (Top Bar uses `effect/blur/md`), and its 20% is hard-coded (no Background opacity token).
- Collapsed gap 16 is bound to `Expanded Padding` (name says padding, used as the collapsed gap); collapsed padding 24 / 0 is unbound.
- Footer slot padding 12 unbound; Sub Header slot is FIXED 280 with padding 10 (wider than the 248 content box).
- Collapsed Top Bar slot keeps the 55px logo inside a 32px content box (overflows, clipped).
- Toggle is a bare `li:panel-left` icon (no button, no states, no focus).
- Default Body List Items show a trailing chevron (nav rows usually don't).
- Doc: "This molecule" on an Organism page; border colour listed as `border/accent`.
