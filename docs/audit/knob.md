# Audit — Knob page (Phase 4.5)

- **Figma page:** Knob `2508:11169` (doc frame `7152:11894`), Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Knob `7152:11904` (State Default/Hover/Pressed × Disabled off/on = 4 variants; `Focused` BOOLEAN)
- **React:** `Knob` (a visual atom; used as the thumb in `Range`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `state` default/hover/pressed ↔ State (omit it for live hover/press); `disabled` ↔ Disabled. `Focused` has no prop by design: the Knob is a non-focusable `<span>` and the focusable host (Range's `Slider.Thumb`) owns the ring. ❌ Figma Disabled values are lowercase `off`/`on` (the naming pattern is `Off`/`On`) → [designer]. |
| 2 | States | ✅ Default / Hover / Pressed; Disabled exists only with State=Default, as 0.40 `opacity/disabled` on the whole knob (React forces the default handle when disabled) ✅. |
| 3 | Colours | ✅ Container `bg/surface`; handle Default `neutral/subtle`, Hover `accent/hover`, Pressed no fill + `overlay/pressed` stroke. The container stroke `border/default` is at Border Weight `none` (0px), so nothing renders. React omits it, and the drift spec is green. |
| 4 | Dimensions | ✅ Size 24, Padding 4 (handle 16), Radius full, Border Weight none. ❌ **Pressed handle stroke is 1px** (unbound, INSIDE); React drew `border-2` → **[code]** `border` (1px, border-box = inside). [designer] bind it to `- Border Weight -/thin`. Nit: the container `itemSpacing` is bound to `- Spacing -/10` with a single child (no effect) → [designer]. |
| 5 | Typography | n/a (no text) |
| 6 | Anatomy | ✅ The surface frame wraps the Handle rectangle, with `effect/shadow/down/sm` (React `--effect-shadow-down-sm`) ✅. |
| 7 | Focus | ✅ Figma: `.Focus-ring` instance + `Focused` BOOLEAN, absent from Disabled. The ring is 1px (`/thin`) at −3; React uses 2px with a 2px offset (the cross-page decision from the Buttons audit). ❌ **Range thumb showed no keyboard focus at all:** it used `focus-visible:ring-*` on `Slider.Thumb`, but Base UI focuses the hidden `<input>` *inside* the thumb, so `:focus-visible` never matched → **[code]** new shared `focusRingWithin` (`has-[:focus-visible]:` variant of `focusRing`) applied to the thumb. Verified in Playwright: the ring shows on Tab in light and dark. |
| 8 | A11y | ✅ The knob is decorative; the slider's input carries the role, value and keyboard handling (Base UI). The focus fix is above. No text, so contrast n/a. |
| 9 | Doc page | ✅ The variant count, tokens and colour table match. ❌ It says the Knob is "used inside Switch and Slider", but Switch has its own knob (`-- Atoms/Selection Control/Switch/Knob Padding`) in Figma and React → [designer]. It also writes Focused as "true \| false" (fine) and Disabled as "off \| on" (see #1). |
| 10 | Story | ✅ Controls cover `state` + `disabled`; the States matrix stays (it labels each state side by side). |

## Code fixes applied
1. Knob Pressed handle `border-2` → `border` (1px, matches the master).
2. Range thumb focus: `focus-visible:ring-*` (never matched) → shared `focusRingWithin`, now visible on keyboard focus.
3. `utils/focus-ring.ts`: new `focusRingWithin` export for wrappers whose focusable element is a descendant.

**Contrast baseline:** unchanged, 24 findings / 15 of 23 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Knob ✓, Range ✓). Playwright light + dark: Knob States, Range keyboard focus, Range pressed thumb.

## For the designer (→ PROGRESS.md)
- Disabled values `off`/`on` → `Off`/`On`.
- The Pressed handle stroke is an unbound 1px; bind it to `- Border Weight -/thin`.
- The container `itemSpacing` is bound to `- Spacing -/10` with a single child; drop the binding.
- The doc page says the Knob is used in Switch, but the Switch has its own knob.
