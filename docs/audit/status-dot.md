# Audit — Status Dot page (Phase 4.5)

- **Figma page:** Status Dot `2170:19`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** `.Status-avatar` `7201:12` (Type Default/Busy/Away/DND/Offline = 5 variants)
- **React:** `StatusDot`
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads, a master screenshot and the doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `status` default/busy/away/dnd/offline ↔ Type; `label` gives it an accessible name. |
| 2 | States | n/a (static indicator). |
| 3 | Colours | ✅ Fills: Default `status/success/default`, Busy `status/danger/default`, Away `status/warning/default`, DND `status/danger/border`, Offline `bg/surface`; stroke `border/muted`. ❌ **Offline's stroke is `border/hover`** in the master, not `border/muted` → **[code]** fixed (it's the only outline you see on an empty dot). |
| 4 | Dimensions | ✅ Size 8px (`-- Atoms/Status Dot/Size`). ❌ The 1px stroke was hardcoded (`border`) → **[code]** bound to `border-weight.thin` (`-- Atoms/Status Dot/Border Weight`). |
| 5 | Typography | n/a |
| 6 | Anatomy | ❌ **DND was missing its "DND Line"**: a `bg/surface` minus bar, 5.1 × 2.2px on the 8px dot, centred, constraints SCALE → **[code]** added as an `::after` bar (64% × 27% of the whole dot, stroke included). Measured in the browser: 5.11 × 2.16px. |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ `role="img"` + `aria-label` when `label` is set, otherwise decorative. The DND bar means DND no longer relies on colour alone to differ from Busy (both are red). |
| 9 | Doc page | ✅ 5 variants, 2 tokens, colour mapping. ❌ The doc text doesn't mention the Offline `border/hover` stroke or the DND bar → [designer]. The set is named `.Status-avatar`, not "Status Dot" like the page and tokens → [designer] nit. |
| 10 | Story | ✅ Controls: status; AllStatuses matrix. Title `Atoms/StatusDot` → `Atoms/Status Dot` (the Figma name, like the other atoms). |

## Code fixes applied
1. Offline stroke → `border/hover`.
2. Stroke width bound to `border-weight.thin`.
3. DND minus bar (`bg/surface`), proportional to the dot.
4. Story title → `Atoms/Status Dot`.

**Note for the Avatar page:** `Avatar` does not compose `StatusDot` yet. Check that next.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components (no text).
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Status Dot ✓), biome. Playwright light + dark of AllStatuses; computed border width/colour and DND bar size checked in the DOM.

## For the designer (→ PROGRESS.md)
- Doc text: add the Offline `border/hover` stroke and the DND minus bar.
- The set is named `.Status-avatar`; the page and tokens call it Status Dot.
