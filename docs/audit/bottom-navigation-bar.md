# Audit — Bottom Navigation Bar page (Phase 4.5)

- **Figma page:** Bottom Navigation Bar `2073:4511`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Bottom Navigation `2600:2203` (COMPONENT_SET: `Type` Simple / More; `Items Slot` SLOT) · `_Nav Item` `2073:9271` (`State` Default / Hover / Pressed / Active / Disabled; `Dot` BOOLEAN; `Content Instance` swap) · Nav Item Content `2073:4684` (`Label` TEXT, `Icon Instance` swap) · Bottom Navigation Avatar `2073:9045` (Avatar S, no label)
- **React:** `BottomNavigation` (`items`, `value`, `onValueChange`; pure-controlled by convention)
- **Audited:** 2026-10-25, via read-only `use_figma` reads of the four masters (props, anatomy, bindings, per-state content colours, dot geometry, More menu), the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Items Slot → `items`; State Active → `value`; Dot → `dot`; Disabled → `disabled`; Content swap → `icon` + `label`. ❌ Type=More (trailing item opens an Item List above the bar) was only an ellipsis item → **[code]** new item `menu` (shared `DropdownMenu`, shows Active while open). ❌ Bottom Navigation Avatar has no label → **[code]** new `hideLabel` (label stays the accessible name). |
| 2 | States | ✅ Hover `bg/subtle`, Active `accent/surface` + `accent/default`, Disabled `opacity/disabled`. ❌ Pressed was an `accent/subtle` fill; master = **`overlay/pressed`** fill + **`accent/subtle`** content → **[code]**. ❌ Active widened its padding to 12 (master keeps 10) → **[code]** removed. Hover / pressed now skip the active item; hover skips pressed (variant order). |
| 3 | Colours | ✅ Bar `bg/surface` + top `border/default`; default content `text/secondary`. ❌ Shadow `up/md` → master **`effect/shadow/up/sm`** → **[code]**. More list: Item List with `effect/shadow/up/md` → **[code]** on the menu. |
| 4 | Dimensions | ✅ Bar padding 8, radius none, Border Weight thin, Nav item radius `l`, padding 10 / 4, gap 4, icon 24. ❌ Items hugged at 52; master is a **fixed 56** → **[code]** `size-56`. ❌ Items were `justify-around` with a 4 gap; master's slot is **SPACE_BETWEEN** (gap 10) → **[code]**. ❌ Dot was an 8px red circle on the icon; master = **12px `.Status-avatar` Busy**, pinned 2 from the top / 3 from the right of the item → **[code]** `StatusDot` busy (adds its `border/muted` stroke). **[deviation]** The More list hugs (125) instead of the master's FIXED 136, as the Dropdown popup. |
| 5 | Typography | ❌ Label `text-xs` regular → **Caption/300** (12 / 130% / +0.5%, light) → **[code]**. |
| 6 | Anatomy | ✅ Bar → items (icon over label, dot overlay). More: list 8 above the bar, end-aligned (React: 7 / end). |
| 7 | Focus | ❌ No focus ring (code comment said "mobile-only") → **[code]** `focusRing` (pressable, hybrid model; keyboards and switch access exist on mobile). Master has no Focused state → [designer]. |
| 8 | A11y | ✅ `<nav>` + buttons, `aria-current="page"` on the active item; More is a Base UI Menu trigger (`aria-haspopup` / `aria-expanded`); avatar item named by its hidden label. Contrast: Active `accent/default` on `accent/surface` 3.83 dark (kept as Figma, already counted); the More trigger's open state repeats that pairing → **31 findings / 19 of 31** (no new component, no new colour pair). |
| 9 | Doc page | `.Status-avatar` size is bound to the old **`--- Atoms ---/--- Avatar/Status-size`** token (`---` = wrong). Doc says "accent/surface → Palette/primary/50" etc. (✅). No mention of Pressed's `accent/subtle` content. |
| 10 | Story | ❌ Story used Home / Search / Saved / Profile + a disabled item, a labelled avatar, and a More item with no menu → **[code]** master items Home / Explore / Inbox / Projects + label-less Avatar; More story opens Favorites / Profile / Settings. |

## Code fixes applied
1. Bar: `up/sm` shadow, SPACE_BETWEEN with a 10 gap.
2. Items: fixed 56, Caption/300 labels, master Pressed (`overlay/pressed` + `accent/subtle`), no Active padding change, `focusRing`.
3. Dot: 12px busy `StatusDot` on the item corner.
4. New `menu` (Type=More) and `hideLabel` (Avatar item); `DropdownMenu` gains `side` / `sideOffset` (also reachable through `Dropdown`).
5. Stories on the master's items.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast 31 / 19 of 31 (the extra line is the Active pair via `data-[popup-open]`). Playwright (light + dark): bar 393 × 73 (72 + top stroke), items 56 tall, labels 12 / 15.6 / 300 / 0.06px, dot 12 at top 2 / right 3; hover `bg/subtle`, pressed `overlay/pressed` + `accent/subtle`, click → active; More opens a list 7 above the bar, end-aligned, trigger in the Active look; Tab → ring visible.

## For the designer (→ PROGRESS.md)
- `.Status-avatar` (Dot) size bound to the old `--- Atoms ---/--- Avatar/Status-size` token.
- `_Nav Item` has no Focused state.
- Items Slot gap 10 and the dot offsets (2 / 3) are unbound.
- More list is FIXED 136 (Item List hugs elsewhere).
