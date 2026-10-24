# Audit — Tabs page (Phase 4.5)

- **Figma page:** Tabs `2074:10898`, working file `sX5tikviuBEhNbu2iPVya5` (two doc frames: Switcher `7248:19`, Tabs Group `7249:35`)
- **Masters:** Navigation / Switcher `3076:24` (COMPONENT, no props) + `.Switcher Item` `3074:36` (State Default/Active/Hover/Pressed, Label, Show Icon, Icon swap); Navigation / Tabs Group `2050:50076` (Show Divider BOOLEAN, Tabs Slots SLOT) + `_Internals / Tab Item` `2050:50042` (State × Fill Underline/Full × Disabled × Start × End, 30 variants)
- **React:** `Switcher` (Base UI ToggleGroup), `Tabs` (Base UI Tabs)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads of all four masters, master screenshots, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## Switcher

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Items (Label, Show Icon / Icon → optional `icon`), one active item → `value` / `defaultValue` / `onValueChange`. `disabled` per item is React-only (harmless, best practice). |
| 2 | States | ❌ Hover / Pressed had no styling. Figma's Hover / Pressed item fill is `bg/subtle`, the container's own colour, so in the wrapper only Pressed's `text/primary` label shows → **Decision:** hover + pressed = label `text/primary` [code]; the invisible fill → [designer]. ✅ Active = `bg/surface` + Body/SM/700 `text/primary` + shadow sm. |
| 3 | Colours | ✅ Container `bg/subtle`; label `text/secondary` / active `text/primary`. Active shadow is a raw drop shadow (y2 blur6 black 8%), not the `effect/shadow/sm/down` style → React keeps `--effect-shadow-down-sm` [designer]. |
| 4 | Dimensions | ✅ Container padding 4, gap 2, radius full; item 16 × 8 padding, gap 8, radius full, icon 16. |
| 5 | Typography | ✅ Body/SM/300 (active Body/SM/700) = `text-sm font-light` / `font-bold`. |
| 6 | Anatomy | ✅ Container → items (icon + label). |
| 7 | Focus | ❌ Inline ring classes (no offset) → **[code]** shared `focusRing`. Figma has no focus (rings reverted 2026-09-13) → [designer]. |
| 8 | A11y | ✅ ToggleGroup: `role=group` + `aria-pressed` buttons, arrow keys; can't be deselected (guarded). ❌ Resting label `text/secondary` on `bg/subtle` = 3.86 light / 4.04 dark (same pair as Segmented) → kept as Figma, now declared in `contrast-audit.ts` [designer]. |
| 9 | Doc page | ✅ 8 tokens listed match the bindings. Says "Slot pattern" but the wrapper has no SLOT property (plain children) [designer]. |
| 10 | Story | ✅ Default + WithIcons. |

## Tabs

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ❌ **Fill** (Underline / Full) had no prop → **[code]** `fill: 'underline' \| 'full'` (default underline). Start / End are positional → derived (`first:` / `last:`), no prop. Disabled → `disabled` per item ✅. `icon` per item and panels (`content`) are React-only [deviation, kept]. Show Divider: bound to nothing in the master (the 5 hidden `Divider` vectors in the slot have no property refs) → no prop [designer]. |
| 2 | States | ❌ Hover was a text colour change only. Figma Hover = `overlay/hover` fill + `text/on-accent` (1.91 light), Pressed = `accent/default` + `text/on-accent` (2.85 dark) → **Decision:** List Item states: hover `accent/subtle` + `text/primary` (skipped on the active tab), pressed `accent/active` + `text/on-accent` [code]. ❌ Disabled used `disabled:` but Base UI marks a disabled Tab with `data-disabled` (no attribute), so it never dimmed → **[code]** `data-[disabled]:` opacity + no pointer events. Full Disabled variants have no opacity in Figma (Underline ones do) [designer]. |
| 3 | Colours | ❌ Active label was `accent/default`; the master keeps `text/secondary` in every state → **Decision:** match Figma [code]. Underline: each tab owns a bottom `border/muted` line, active `accent/default` → **[code]** per-tab border (the separate full-width list border + sliding Indicator removed). Full: `bg/default`, active `accent/surface` → **[code]**. |
| 4 | Dimensions | ✅ Padding 16 × 12. ❌ Radius `sm` was on every tab → **[code]** outer corners only (Start = left, End = right), as the master. ✅ Underline weight `border-weight-thin`. Height: 45 (14px/20 line + 24 + 1); the master's 34 is the 10px text-box artifact. |
| 5 | Typography | ✅ Body/SM/300 = `text-sm font-light`. |
| 6 | Anatomy | ❌ The tab bar spanned the full width → **[code]** `inline-flex`, hugging its tabs like the Tabs Group. ✅ Slot of Tab Items → `items`. |
| 7 | Focus | ❌ Inline ring classes → **[code]** shared `focusRing` (the bar has no overflow clip, so the offset ring shows in full). Figma has no focus → [designer]. |
| 8 | A11y | ✅ Base UI Tabs: `tablist` / `tab` / `tabpanel`, arrow keys, disabled tabs skipped. ❌ Full active `text/secondary` on `accent/surface` = 4.26 light / 4.46 dark → kept as Figma (decision), declared in `contrast-audit.ts` [designer]. The selected Underline tab is marked by a 1px line only (label unchanged) → [designer] consider a label change or a thicker indicator. |
| 9 | Doc page | ✅ 4 tokens match. Show Divider is described ("bottom border line") but does nothing [designer]. |
| 10 | Story | ✅ `fill` in Controls; a disabled tab added to the Default items. |

## Code fixes applied
1. `Tabs`: `fill` axis (cva); per-tab underline (`border/muted` → active `accent/default`) or Full fill (`bg/default` → active `accent/surface`); label `text/secondary` in every state; hover `accent/subtle` + `text/primary`, pressed `accent/active` + `text/on-accent`; outer-corner radius; `data-[disabled]` opacity; shared `focusRing`; the bar hugs its tabs.
2. `Switcher`: hover / pressed label `text/primary`; shared `focusRing`.
3. `contrast-audit.ts`: Switcher (resting label on the container) and Tabs (base + Full active) pairings declared.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast **29 findings / 19 of 30** (was 27 / 17 of 29: the two declared Figma pairs above; Tabs entered the audit). Playwright light + dark, clicked through: hover wash `accent/subtle` + `text/primary` (#E0E7FF / #0F172A light, #3730A3 / #F8FAFC dark); underline border `border/muted` with accent on the active tab; Full active `accent/surface`; disabled tab opacity 0.4, click leaves the selection unchanged; keyboard focus ring visible with its offset; Switcher hover label `text/primary`, active pill bold + shadow, clicking the active item keeps it selected.

## For the designer (→ PROGRESS.md)
- Tab Item Hover `overlay/hover` + white = 1.91 light, Pressed `accent/default` + white = 2.85 dark (React: List Item states).
- Tab Item active label stays `text/secondary`; Underline selection = a 1px line only (weak cue). Full active `text/secondary` on `accent/surface` = 4.26 / 4.46.
- Tab Item Full Disabled variants have no opacity (Underline ones use `opacity/disabled`).
- Tabs Group `Show Divider` is bound to nothing; 5 hidden unbound `Divider` vectors sit in the slot.
- Switcher Item Hover / Pressed fill `bg/subtle` = the container colour (invisible); resting label `text/secondary` on `bg/subtle` = 3.86 / 4.04.
- Switcher Active shadow is a raw effect, not `effect/shadow/sm/down`; the doc says "Slot pattern" but the wrapper has no SLOT property.
- Neither component has focus (needs a Focused BOOLEAN + `.Focus-ring`).
