# Audit — Stats card page (Phase 4.5)

- **Figma page:** Stats card `2015:2240`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Stats card big `4920:960` (`Size` Desktop / Mobile; Heading, Top Actions, Tabs, Filter, Footer Action swaps; Show … booleans) · Stats card small `4912:713` (`Size` S 360 / L 560; Icon Leading / Trailing, Heading, Legend, Chart, Action Bar) · Stats card compact `4986:434` (`Size` Vertical / Horizontal) · `Chart` `4733:1424` (14 types × XS / S / M / L) · `_Chart Legend` (+ Item) · `_Metric Standard` / `_Metric Headline` / `_Metric Avatars` / `_Metric User` · `_Comparison Metric` / `_Comparison Group`
- **React:** `StatsCard` (`variant` big / small / compact, `size`, `orientation`, slots) + `StatsMetric`, `StatsComparison`, `ChartLegend`, `chartTheme`
- **Audited:** 2026-10-25, via read-only `use_figma` reads of the three card sets, every internal, the Chart set's colour / stroke / text bindings, and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Decision — charts (user, 2026-10-25)
**Layout-only + slot.** The DS doesn't draw charts. `StatsCard` lays out and sizes a `chart` slot; any library (or an image / sparkline) renders into it. `chartTheme` exports the Chart master's colours and strokes as CSS values (series accent → success → warning → danger → info, grid `border/muted` at Grid Stroke, axis `text/muted`, Line Stroke, Axis Gap), so an SVG library themes itself from the tokens and follows light / dark. Storybook shows the recipe with **Recharts** as a Storybook-only dev dependency (`recharts@2.15.4`); `@max-core-ds/react` has no chart dependency. An optional `@max-core-ds/charts` package can come later without breaking this. Why: the Chart master is 14 types × 4 sizes of static vectors, a chart engine's worth of scope (data, scales, interaction, a11y), and the library choice is app-specific. The heatmap ramp (`Palette/primary/100–900`) isn't in `chartTheme`: primitives aren't exported as CSS vars.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ❌ The old `StatsCard` was a placeholder (`title` / `value` / `delta` / `chart`, `big` / `compact`) that matched none of the three families → **[code]** rebuilt: `variant` big / small / compact; Big `size` desktop / mobile; Compact `orientation` vertical / horizontal; slots per the master (`icon`, `menu`, `heading`, `actions`, `tabs`, `filter`, `legend`, `chart`, `info`, `footer`; Show … = omit). Small S / L is width only (the caller's). New parts: `StatsMetric` (= _Metric Standard + Headline; `children` replace the headline for _Metric Avatars / User), `StatsComparison` (+ `trend` down → danger, an extension), `ChartLegend`. |
| 2 | States | n/a (static card). Info icon = focusable Tooltip trigger (the master's is a bare icon). |
| 3 | Colours | ❌ Shell was `border/default`, no shadow → master **`border/muted`** 1px + **`effect/shadow/down/sm`**, `bg/surface` → **[code]**. Labels `text/secondary`, values / icons `text/primary`, dividers `border/muted`, delta `status/success`, legend dots the series order → **[code]**. |
| 4 | Dimensions | ✅ Global Padding 16 / Item Spacing 16 / Radius md; Compact 12 / 12; Header Item Spacing 12; Legend Bottom Padding 8; Info Group Gap 6. ❌ Small's legend → chart gap 24, metric gaps 4 / 8, comparison 4 / 6 / 2, legend 12 / 6 → **[code]**. Card heights 480 (big) / 350 (small) are the master's fixed, unbound sizes; the chart fills what's left. Compact chart 60 (vertical) / 80 (horizontal). Compact heights 239 / 198 vs 220 / 180 are the open cap-trim sweep. |
| 5 | Typography | ❌ Old title `text-sm`, value `text-3xl font-black` → master: label **Caption/700**, value **Heading/H5**, comparison value **H6** + delta **Body/MD/300**, legend + footer info **Caption/XS** → **[code]**. |
| 6 | Anatomy | ✅ Small: top row (icon · menu) → metric → legend + chart → Action Bar. Compact: top → metric → legend → chart (vertical) / top → metric + chart → legend (horizontal). Big: metric + Top Actions → divider → Tabs ⟷ Filter (Mobile: Filter over Tabs, Icon Only actions) → legend → chart → divider → info + Link Button. |
| 7 | Focus | ✅ Slot content keeps its own focus; info icon `focusRing`. |
| 8 | A11y | ✅ Delta has an "Up" / "Down" text alternative; legend is a `<ul>`; info Tooltip reachable by keyboard. Contrast: StatsCard ✓ (enters the audit now: 31 findings / **19 of 32**). Charts' own a11y is the library's job (documented). |
| 9 | Doc page | Chart master type "Area dublu" (Romanian, → "Area double"). Card stroke weight 1 unbound (`Global/Border Weight` bound nowhere). Big Mobile's Top Actions are Icon Only Buttons with `text/on-accent` icons (Primary), Desktop an Action Bar. |
| 10 | Story | ❌ Placeholder stories → **[code]** Small, Big, BigMobile, Compact, CompactHorizontal on the master's content with a themed Recharts line / spark line, + Parts (comparison pair, avatars metric). |

## Code fixes applied
1. `StatsCard` rebuilt on the three Figma families (breaking: `title` / `value` / `delta` removed; `variant` values big / small / compact).
2. New `StatsMetric`, `StatsComparison`, `ChartLegend`, `chartTheme`.
3. Storybook: Recharts dev dependency + the theming recipe.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast 31 / 19 of 32 (StatsCard added, passes). Playwright (light + dark, on a second Storybook at :6007 — the running :6006 needs a restart to load Recharts): small 360 × 350, big 768 × 480, mobile 320 × 480, padding 16 / 12, `border/muted` 1px, radius 8; Recharts line `accent/default` 2px, grid `border/muted`, ticks `text/muted`, switching with the theme; Tab → info icon → Tooltip opens.

## For the designer (→ PROGRESS.md)
- Card stroke weight 1 is unbound (`Global/Border Weight` exists, bound nowhere); card heights 480 / 350 unbound.
- Chart type value "Area dublu" → "Area double".
- No chart palette tokens: series reuse accent + status colours, heatmap uses raw `Palette/primary/*` primitives.
- Info icons are bare icons (no tooltip / interaction defined).
