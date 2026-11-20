# Audit — List item page (Phase 4.5)

- **Figma page:** List item `127:1524` (doc frame `7198:17`), Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** List item `7198:27` (State Default/Active/Hover/Pressed × Disabled × Collapsed = 10 variants)
- **React:** `ListItem` (also used by `ItemList`, `SideBar`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads + doc-page text. The colours and
  typography were already re-checked on 2026-10-23 (`679a87a`); this pass covers the full checklist.

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `leftIcon`/`rightIcon` ↔ Show Leading + Leading Content / Show Trailing + Trailing Content (present = shown); `children` ↔ Label (Show Label = omit it); `supportText` ↔ Show support text + Support text; `level` 0/1/2 ↔ Level 1 / Level 2 booleans (mutually exclusive in React, which is the only sensible reading); `active` ↔ State=Active; `collapsed` ↔ Collapsed; `disabled` ↔ Disabled. Nothing invented, nothing missing. |
| 2 | States | ✅ Default / Hover (`accent/subtle`) / Pressed (`accent/active`) / Active (`accent/default`); Disabled = `opacity/disabled` 0.40 on the row, no colour swap ✅. React never applies hover/pressed over the Active fill ✅. |
| 3 | Colours | ✅ Fills as above; label `text/primary` at rest and on hover, `text/on-accent` on Active; icons `text/primary`, `text/on-accent` on Pressed/Active; support text `text/secondary`. **[deviation]** (kept from `679a87a`, contrast-driven): Pressed label `text/on-accent` (Figma `text/primary` = 2.3:1); hover support text `text/primary` (Figma `on-accent-muted` = 1.1:1); Active+Collapsed icon `text/on-accent` (Figma `text/primary`); Disabled support text follows the rest state (Figma `on-accent-muted`). Already on the designer list. |
| 4 | Dimensions | ✅ Padding X/Y 12 (`--spacing-12`), Gap 8, Icon Size 20, Radius `l` (12); Level spacers 12/24; drift green. Row height = 12 + 20px icon + 12 = 44 ✅ (the label text box reads 9px tall, the stale-text-box artifact again, but the icons set the height, so no visual effect). Collapsed = 44×44 ✅. ❌ **The Label Helper Gap is bound to `-- Molecule/Item List/Label Helper Gap`**, the parent molecule's token, not a List Item token (lesson 12 in CLAUDE.md, cross-refs) → [designer]. React uses `--spacing-04`. |
| 5 | Typography | ✅ Label `Caption/700` (React `text-xs font-bold`); support text `Caption/300` (`font-light`). |
| 6 | Anatomy | ✅ Level 2 / Level 1 spacer → leading → label frame (label + support) → trailing. ❌ The **Disabled variants have no Level spacer rects**, so a nested disabled row loses its indent in Figma → [designer]. React keeps the indent. |
| 7 | Focus | ✅ Pressable: Figma has a `.Focus-ring` instance + a `Focused` BOOLEAN, hidden by default, absent from Disabled ✅; React `focusRing` (2px `border/focus`, 2px offset, keyboard-only, follows the row radius). Playwright: ring visible on Tab, expanded and collapsed, light and dark. ❌ The ring instance geometry is off-spec: x −2 / y −2.5, size +4/+5 (240×44 → 244×49), corner radius reads 0, where the spec is −3 STRETCH on every side around the 12px-radius row → [designer]. All 8 rings bind `- Border Weight -/thick` (2px), which matches React's 2px but not the other pages' 1px rings (part of the cross-page `.Focus-ring` unification). |
| 8 | A11y | ✅ `<button type="button">`; `aria-current` on the Active row; disabled = native `disabled` (not focusable); collapsed rows need an `aria-label` (shown in the Collapsed story). Contrast: unchanged, 2 dark-mode findings (`text/on-accent` on `accent/default` 2.85 and on `accent/active` 1.91). Both come from the dark accent ramp, fixed Figma-side. |
| 9 | Doc page | ✅ "10 variants", the property list and the 5 component tokens all match the master. Minor: the doc says nothing about the Label Helper Gap coming from Item List (see #4). |
| 10 | Story | ❌ `leftIcon`/`rightIcon` had `control: false`, so Show Leading / Show Trailing couldn't be toggled → **[code]** select controls with a mapping (None / icon choices). The other axes were already covered by Controls; the States/Nested/Collapsed/List stories stay (they show combinations that Controls can't). |

## Code fixes applied
1. Story: `leftIcon` / `rightIcon` select controls (None + 2 icons each) so Show Leading / Show Trailing and the swaps can be driven from Controls.

No component changes. The 2026-10-23 re-check (`679a87a`) already brought typography, `supportText` and `level` in line.

**Contrast baseline:** unchanged, 24 findings / 15 of 23 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✅. Playwright light + dark: States, Nested, Collapsed, hover, pressed, keyboard focus (expanded + collapsed), no-icons via args.

## For the designer (→ PROGRESS.md)
- The Label Helper Gap is bound to `-- Molecule/Item List/Label Helper Gap`. Add `-- Atoms/List Item/Label Helper Gap` (→ `- Spacing -/04`).
- The Disabled variants have no Level 1 / Level 2 spacers (nested disabled rows lose their indent).
- The `.Focus-ring` instances sit at −2/−2.5 with radius 0 instead of −3 STRETCH following the row radius. All 8 bind `/thick` (2px), unlike the 1px rings elsewhere; unify with the `.Focus-ring` master.
- The colour deviations already listed (Pressed label, hover/disabled support text, Active+Collapsed icon) still stand.
