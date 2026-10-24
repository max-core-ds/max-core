# Audit — Tag page (Phase 4.5)

- **Figma page:** Tag `2183:5208`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Tag `121:2323` (wrapper: State Default/Focused/Hover/Pressed × Disabled, 5 variants) · .Tag-option `54:34` (Size S/M × Variant Primary/Outline/Ghost × Tone ×4 × Selected; 32 variants, Selected=On on Primary only)
- **React:** `Tag`
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ variant/tone/size/selected + left/right icon ↔ the .Tag-option axes + Show left/right icon + swaps. ❌ **The Figma wrapper is interactive** (State + Disabled); React was a static `<span>`. **Decision (user): interactive when clickable.** Passing `onClick` or `selected` renders a `<button aria-pressed>` with states, focus and `disabled`; otherwise it stays a display-only `<span>` → **[code]**. |
| 2 | States | ❌→✅ Hover = `_StateOverlay` `overlay/hover` @ 0.4, Pressed = `overlay/pressed` @ 0.6, Disabled = wrapper @ `opacity/disabled`. Added for clickable tags. ❌ The master binds the overlay opacities to `opacity/disabled` (Hover) and `opacity/dim` (Pressed) instead of `opacity/hover`/`pressed`. ❌ `overlay/hover` is indigo for every tone, so a hovered success/warning/danger chip shifts toward indigo → [designer]. React mirrors the bindings as-is. |
| 3 | Colours | ✅ Primary Off = `accent/subtle` + `border/default` + `accent/active` label; status Off = `status/*/subtle` + `/border` + `/default`. Ghost = tone text. ❌ **Borders:** Selected Default = `border/accent` (React `transparent`). Selected status = `status/*/border` (React `transparent`). Outline status = `status/*/border` (React used the solid `status/*/default`) → **[code]**. ❌ **Outline Default has a `bg/subtle` fill** (React transparent) → **[code]**. |
| 4 | Dimensions | ✅ S/M Padding X/Y 6/8, Gap 4/6, Min Height 28 (raw) / 32, Radius sm, Border thin, Icon 16. |
| 5 | Typography | ✅ `Caption/300` at both sizes. |
| 6 | Anatomy | ✅ left icon · label · right icon (`li:x` default). |
| 7 | Focus | React ✅ shared `focusRing` on clickable tags. Figma ❌: Focused is a **State value** (should be a BOOLEAN), `.Focus-ring` 1px → [designer] |
| 8 | A11y | ✅ Clickable tags are a native `<button type="button">`, with `aria-pressed` reflecting Selected. Contrast ❌: **5 findings** now visible because the colour literals live in `Tag.tsx`. 4 are the dark accent/status ramp on solid Selected chips (2.08–2.90). 1 is Outline Default `text/secondary` on the new `bg/subtle` fill, 3.86 light / 4.04 dark, the same pairing kept on Segmented by decision. Kept to match Figma → [designer]. |
| 9 | Doc page | ✅ The token table matches. ❌ Minor: the doc lists Selected generally, but it only exists on Primary. |
| 10 | Story | ✅ Controls cover every axis. `Selected` is now a live filter-chip demo (toggle, disabled), which Controls can't show. |

## Code fixes applied
1. Clickable tag (`onClick` / `selected`) → `<button aria-pressed>` + Figma overlay hover/pressed + `focusRing` + opacity Disabled. Display-only stays a `<span>`.
2. Borders: Selected `border/accent` / `status/*/border`. Outline status `status/*/border`.
3. Outline Default fill `bg/subtle`.
4. Removed the now-unused `accentFill` / `statusFill` from `utils/tone.ts`.
5. Story `Selected` → an interactive filter-chip demo.

**Contrast baseline:** 25 findings / 16 of 23 components (was 20 / 15). All 5 new findings follow the Figma bindings.
**Verified:** typecheck, build, Storybook tsc, drift ✅. Playwright: all variants in light and dark. Clicking toggles `aria-pressed`, disabled is skipped. Hover, pressed and focus captured.
**Unrelated, pre-existing:** `apps/showcase` tsc fails on `<Badge tone="neutral">` (fails on clean `main` too) → Badge audit.

## For the designer (→ PROGRESS.md)
- Wrapper Focused → BOOLEAN; `.Focus-ring` 2px.
- Overlay opacities bound to `opacity/disabled` / `opacity/dim`: rebind to `opacity/hover` / `opacity/pressed`?
- `overlay/hover` / `overlay/pressed` are indigo for every tone, so status chips turn purple-ish on hover.
- Outline Default `text/secondary` on `bg/subtle` fails AA (3.86 light). Selected status chips fail in dark (ramp).
