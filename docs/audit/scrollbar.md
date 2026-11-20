# Audit — ScollBar page (Phase 4.5)

- **Figma page:** "ScollBar" (sic) `2344:8063` (doc frame `7160:626`), Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** ScrollBar `2344:8067`, a standalone COMPONENT (no set, no properties)
- **React:** `ScrollBar` (standalone + driven rail), `ScrollArea` (external rail driven by scroll), the
  `.styled-scrollbar` / `.scrollbar-none` utilities (`@max-core-ds/tokens/scrollbar.css`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ The master has no properties; React standalone `<ScrollBar />` takes none either. `thumbSize` / `thumbOffset` / `orientation` (driven mode) and `ScrollArea` are **[deviation]** extensions with no Figma counterpart: Figma draws only the static 24px pill, and code needs a thumb that tracks real scroll. |
| 2 | States | ✅ None in Figma ("no states, no disabled, no focus"). **[deviation]** `.styled-scrollbar` darkens the native thumb to `accent/default` on hover, as feedback on a real browser control. The ScrollArea rail has no hover. |
| 3 | Colours | ✅ Thumb `accent/subtle`, transparent track (standalone, driven rail, native utility). ❌ In light mode `accent/subtle` (#E0E7FF) on `bg/default` (#F8FAFC) is about 1.2:1, so the indicator is barely visible. It's decorative/`aria-hidden`, so not an AA failure, but worth a stronger tint → [designer]. |
| 4 | Dimensions | ✅ Standalone: Padding 4 on every side, Thumb Width 4, Thumb Height 24, Radius full → 12×32, same as the master. ❌ **Driven rail** (ScrollArea, Item List `showScrollBar`) dropped the padding along the scroll axis: the thumb ran flush to both ends of the rail → **[code]** the rail now uses the same `p-[--spacing-04]` on every side around an inner lane (also replaces the `calc(4*3)` cross width), and ScrollArea sizes/positions the thumb within `client − 2×4`. Measured in Playwright: the rail is 12px; the thumb is inset 4px on the cross axis and 4px from the end at full scroll (vertical + horizontal). The native utility (12px bar, 4px transparent border → 4px thumb) ✅. |
| 5 | Typography | n/a |
| 6 | Anatomy | ✅ Track frame (horizontal auto-layout, hug) holding the Thumb rectangle. |
| 7 | Focus | n/a. Figma says "no focus ring", and the atom is `aria-hidden`. The ScrollArea viewport is a native `overflow-auto` scroller, so keyboard scrolling stays with the browser. |
| 8 | A11y | ✅ The indicator is `aria-hidden`; the real scroll region owns semantics and keyboard. **[code]** ScrollArea rail drag now also ends on `pointercancel` (listeners could leak when the browser cancelled a touch drag). Contrast: see #3 (non-text, decorative). |
| 9 | Doc page | ✅ The structure, 4 tokens and colour match the master. ❌ The page name is misspelled "ScollBar"; the doc lists no value for `Thumb Width` (it's `- Spacing -/04` = 4px) → [designer]. |
| 10 | Story | ✅ Default, InContext, NativeScrollbar, ExternalRail (+ horizontal) each show something Controls can't (scroll-driven behaviour, native skinning). |

## Code fixes applied
1. `ScrollBar` driven rail: 4px padding on every side (same as the master/standalone track) around an inner lane, so the thumb stops 4px short of each end.
2. `ScrollArea`: thumb size/offset and drag range computed over the padded lane (`client − 2×RAIL_PADDING`); drag also ends on `pointercancel`.

**Contrast baseline:** unchanged, 24 findings / 15 of 23 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (ScrollBar ✓, Item List ✓). Playwright light + dark: standalone, vertical rail top/bottom, horizontal rail at end, Item List with `showScrollBar` (+ measured insets).

## For the designer (→ PROGRESS.md)
- Rename the page "ScollBar" → "ScrollBar".
- Thumb `accent/subtle` on `bg/default` is about 1.2:1 in light mode, barely visible; consider a stronger tint.
- The doc page shows no value for `Thumb Width` (4px).
