# Audit — Search bar page (Phase 4.5)

- **Figma page:** Search bar `2106:2`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Searchbar `2106:546` (one set, 6 variants: Size S/M/L × Button On/Off; no wrapper / states set)
- **React:** `SearchBar` (also used size-S inside `ItemList`'s `search`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads, a master screenshot, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Size S/M/L; Button=On → `action` (replaces the clear ✕); Placeholder Text → `placeholder`; Right icon → the clear button, shown only when there's a value + `onClear` (a static ✕ on an empty field does nothing) → [deviation]. ❌ **Left icon** (INSTANCE_SWAP + BOOLEAN) had no prop → **[code]** `leadingIcon` (default magnifier, `null` hides). ❌ `className` went to the bare input and `wrapperClassName` to the pill → **[code]** `className` = the pill (as the Inputs page); **breaking:** `wrapperClassName` removed (no users). |
| 2 | States | Figma has **no states** (no hover, focus, disabled). React follows the Inputs field model: hover `border/hover`, focus = `focusBorder`, disabled dims the pill (`has-[:disabled]`) → [designer] add the states. |
| 3 | Colours | ✅ Fill `bg/default`, stroke `border/default`, placeholder `text/muted`. ❌ **Icons** (magnifier + ✕) are `text/secondary`; React used `text/muted` → **[code]**. Clear ✕ hover `text/primary` is React-only. Doc page lists `bg/elevated` / `border/muted` (stale, like Item List) → [designer]. |
| 4 | Dimensions | ✅ Radius full, Border Weight thin, Min Width 180, Gap 6, Padding X/Y 10·8 / 12·10 / 14·12. ❌ **Icon Size:** every variant binds `Size S/Icon Size` (16), so Figma renders 16px at all sizes (32/36/40 tall) while the M/L tokens (20/24) and the doc page say 16/20/24. **Decision:** follow the per-size tokens → [designer] rebind M/L. ❌ Stroke INSIDE vs CSS border → **[code]** padding gives back 1px: measured **32/40/48**, and **48/52/56** with the button (master Button=On frames exactly). |
| 5 | Typography | Master placeholder = **Caption/300 at every size**. **Decision:** keep 12/14/16 regular, consistent with the Inputs decision → [deviation]. |
| 6 | Anatomy | ✅ Left icon → text → ✕ / Button. ❌ Button=On uses a **size-S** Standard Button at every size; the story used M on Size L → **[code]** story. ❌ The master **overrides the Button's radius** with `-- Molecule/Search Bar/Global/Radius` (full); React showed the Button's own `radius/l` → **[code]** the action slot forces `radius-full` on its child (the state layer inherits it). ❌ The instance is **hand-sized to 72/74px**, so the label sits 16px from each side while the Button S Padding X token is 6 → **Decision:** the action slot pads its child `spacing-16` (no fixed width) → [designer] make it a token. |
| 7 | Focus | ❌ 1px `border/focus` recolour → **[code]** `focusBorder` (border/focus 2px, hybrid model, via the shared `fieldBorder`). ❌ The clear ✕ had no keyboard focus style → **[code]** `focusRing`. |
| 8 | A11y | ✅ Clear button `aria-label`; icons `aria-hidden`. Contrast: the pill colours moved into `utils/field.ts`, so SearchBar dropped out of the audit (27 → 26) → `contrast-audit.ts` declares value / placeholder / icon on `bg/default`: all pass AA light + dark. Still 16/27 components, 25 findings. |
| 9 | Doc page | Stale colour list; Size M/L Padding Y have no "Value" line. See the designer list. |
| 10 | Story | ✅ `size` + new `disabled` control wired into Default; Sizes; WithButton (S button everywhere). |

## Code fixes applied
1. `SearchBar` on the shared field model: `fieldBorder` + `fieldFill.primary` + `fieldHover` (`focusBorder`, hover, disabled cursor), inside-stroke padding, disabled dimming.
2. Icons `text/secondary`; `leadingIcon` prop; clear button `focusRing`; the action button takes the bar's full radius and 16px side padding.
3. `className` → pill; `wrapperClassName` removed (breaking).
4. `contrast-audit.ts`: SearchBar pairings. Story: disabled control, S button at every size.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Search Bar ✓), contrast (16 / 27, 25 findings, no new), biome. Playwright light + dark (Sizes, WithButton); measured heights; computed border at rest / hover (`border/hover`) / Tab focus (`border/focus` + 1px inset = 2px); clear button Tab ring.

## For the designer (→ PROGRESS.md)
- Every variant's icons bind `-- Molecule/Search Bar/Size S/Icon Size`; rebind M/L to their own Icon Size tokens (20/24, React follows them).
- Placeholder is Caption/300 at every size; React scales 12/14/16 regular (as Inputs).
- No hover / focus / disabled states on the master; React ships the Inputs field states.
- The Button override rebinds the button's radius to Search Bar Global/Radius, but its State Layer keeps `-- Atoms/Buttons/Global/Size S/Radius` (12), so hover/pressed would paint square-ish corners on a pill.
- The Button instance is hand-resized to a fixed 72/74px (label 16px from each side) instead of using a padding token; React pads it `spacing-16`. Bind it (e.g. a `-- Molecule/Search Bar/Button Padding X` token) or let it hug.
- Doc page colours say `bg/elevated` / `border/muted`; the master binds `bg/default` / `border/default`.
