# Audit — Segmented controls page (Phase 4.5)

- **Figma page:** Segmented controls `2106:573`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Segmented control `7181:19` (set with 1 variant `Options=Default` + `Items` SLOT, 2 preferred values) · .Segmented control-item `7181:28` (`Active` off/on, `Item text`)
- **React:** `SegmentedControl` (Base UI ToggleGroup + Toggle)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `items[]` ↔ the `Items` slot of item instances. `label` ↔ `Item text`. The selected `value` ↔ the one item with `Active=on`. `icon` is React-only → [deviation] (harmless superset; Figma items are text-only). |
| 2 | States | ✅ Active off/on. Figma has no Hover, Pressed, Disabled or Focused; React adds disabled (opacity) and focus → see 7. ❌ **[code] bug:** clicking the active segment **deselected it**, leaving nothing selected (ToggleGroup emits `[]` and the wrapper left it uncontrolled). The group is now always controlled through `useControllableState`, and empty emissions are ignored. Verified in Storybook. |
| 3 | Colours | ✅ Container `bg/subtle` + `border/default`. Active `accent/default` + `text/on-accent`. Inactive label `text/secondary`. ❌ **Contrast:** inactive `text/secondary` on `bg/subtle` = **3.86 light / 4.04 dark**, below AA for 14px Light text. **Decision: keep Figma** (user, 2026-10-24); commented in code and added to the contrast audit (`SegmentedControl` override) → [designer]. Active `on-accent`/`accent` dark 2.85 = the known dark-ramp finding. |
| 4 | Dimensions | ✅ Main Radius full / Padding 8 / Gap 16 / Border thin; Item Radius full / Padding 8 / gap 8 (bound to `Item/Padding`) / Border none. ❌ Figma item renders **26px** tall because the label text box is stuck at 10px high (14px @ 130% should be about 18px), so the true height is 34. React = 36 (Tailwind `text-sm` line height 20) → [designer] (stale text box). |
| 5 | Typography | ❌ Figma `Body/SM/300` (14 Light); React was `text-sm font-bold` → **[code]** `font-light`. |
| 6 | Anatomy | ✅ Container → Items slot → items (label). |
| 7 | Focus | React ❌→✅: an inline `ring-2` copy (no offset) replaced by the shared `focusRing` (pressable, 2px, offset). Figma ❌: items have no Focused BOOLEAN or `.Focus-ring` → [designer]. |
| 8 | A11y | ✅ ToggleGroup: buttons with `aria-pressed`, arrow-key roving focus, `aria-label` passthrough. Contrast: see 3. |
| 9 | Doc page | ✅ The token table and slot instructions match the master. |
| 10 | Story | ✅ Default + WithIcons. `items` control is off (array). |

## Code fixes applied
1. Label weight `font-bold` → `font-light` (Body/SM/300).
2. Focus: inline ring replaced by the shared `focusRing`.
3. Selection can no longer be cleared: controlled ToggleGroup via `useControllableState`.
4. Contrast audit: declares the inactive pairing → **baseline 20 findings / 15 of 23 components** (was 19 / 15).

**Verified:** typecheck, build, Storybook tsc, drift ✅. Playwright: clicking the active segment keeps it selected (`Day:true` before and after). Keyboard focus ring in light and dark.

## For the designer (→ PROGRESS.md)
- Inactive label `text/secondary` on `bg/subtle` fails AA (3.86 light / 4.04 dark). Shipped as-is by decision.
- Add a Focused BOOLEAN + `.Focus-ring` to `.Segmented control-item` (and Hover/Disabled if wanted).
- Item label text box is stuck at 10px high, so the item renders 26px instead of about 34px.
