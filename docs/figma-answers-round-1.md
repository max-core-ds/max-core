# Max Core — answers + Figma fixes, round 1

Hi! Answers to Part A first, then what's already fixed in Figma from Part B and what comes next.

**The principle behind all of it:** Figma is the single source of truth. Everything that exists in Figma as a variable or a style should be exported and drive the code, component tokens included. The goal is to export one JSON, change the tokens (by hand or automatically), and have the whole system take the new shape, code included. Max Core is built in 4 levels for this reason: Primitives → Semantics / Colors → Components.

---

## Part A — answers

### 1. Text styles
**Yes, export them. They're final.** Please drop the code's own type scale.
- Font family and font size are already variables on every style: `- Typeface family -/*` and `text-size/size/*`.
- Weight, line height (%) and letter spacing are set on the style itself. Read them from the style; exporting each style as a composite typography token is fine.
- Fixed in Figma: `Body/LG/700` and `Body/LG/300` weren't bound to a size variable. They now bind `text-size/size/L` (18).

### 2. Leading trim
**Keep cap-height trim on all 15 styles and match it in code**, e.g. `text-box: trim-both cap alphabetic`, with a fallback where the browser doesn't support it. Since Figma is the reference, padding-hugged parts (Tabs, Badge, Segmented items) should come out the same height as in Figma.

### 3. Font family
**Yes, it's meant to be swappable.** The code should read the variables instead of hard-coding Inter:
- `- Typeface family -/base` for UI text (Body, Caption)
- `- Typeface family -/brand` for headings (H1–H6)
- `/mono` is a placeholder (still Inter). Nothing uses it yet.

### 4. Glass and blur
**All 20 effect styles are final. Please export all of them:**
- 8 drop shadows (`shadow/down|up/sm–xl`)
- 3 inner shadows
- 6 background blurs (`blur/xs–2xl`)
- 3 glass (`glass/base|strong|elevated`)

The glass styles use Figma's Glass effect (refraction, depth, dispersion), which has no exact CSS equivalent. Approximate it with a backdrop blur, saturation and a light 1px edge, and keep the drop shadow in `glass/elevated` as it is.

Where they go:
- **Translucent bars** (Top Bar, Side Bar, Bottom Navigation) use a `blur/*` style plus the component's Background opacity token. Top Bar and Side Bar should use the same treatment; we're aligning that in Figma (see "Next").
- **Floating elements** (floating Top Bar buttons, FAB) use the `glass/*` styles.

### 5. Icon sizes
**Follow the component tokens**, e.g. `-- Atoms/Buttons/Global/Size M/Icon Size` or `-- Molecule/Input/Global/Size M/Icon Size M`. They alias `- Size -/*` → `spacing/scale/*`. The `icon/size/*` primitives aren't used by any component token, so ignore them.

Fixed in Figma: Search Bar M and L icons were bound to the Size S token (16px). They now use their own tokens (20 / 24).

### 6. Z-index / layering
**The file does define a layer scale:** `zIndex/*` in Primitives. Please export it and use it instead of ad-hoc values.

| Token | Value | Use for |
|---|---|---|
| `zIndex/base` | 0 | page content |
| `zIndex/dropdown` | 400 | Dropdown, Select / Multiselect list |
| `zIndex/popover` | 500 | Date Picker pane, other anchored popovers |
| `zIndex/tooltip` | 600 | Tooltip, Range tooltip |
| `zIndex/drawer` | 800 | Bottom Sheet, Side Bar as an overlay |
| `zIndex/modal` | 900 | Dialog |
| `zIndex/toast` | 1000 | Toast / Snackbar |
| `zIndex/banner` | 1100 | system banners |
| `zIndex/max` | 9999 | escape hatch |

Added in Figma: a backdrop colour token, **`overlay/scrim`** (black at 50%, same as your code), for Dialog and Bottom Sheet.

### 7. Motion and breakpoints
**They're defined in Primitives. Please export the whole Primitives collection and use it:**
- `motion/duration/fast | medium | slow` = 150 / 250 / 400 ms
- `motion/easing/default | in | out` (cubic-bezier strings)
- `breakpoint/sm … 2xl` = 640 / 768 / 1024 / 1280 / 1536. These are the same as Tailwind's defaults, so your current breakpoints may already match.
- `container/max/desktop | wide` = 1200 / 1440
- `grid/*` (12 columns, gutter, margins per breakpoint)
- `tapArea/min` = 40
- `focus/width` / `focus/offset` = 2 / 2
- `opacity/*`, `border/width/*`

On motion: feel free to go further. Apple-style spring motion is very welcome. Send us the values you settle on (e.g. duration + bounce per spring) and we'll add them to Figma as `motion/*` tokens, so Figma stays the source.

### 8. Component tokens
**Yes, we will rebind component tokens per component, and the code should follow.** Please make the code read the component tokens directly. Cleaning up the bindings in Figma is on our side (Part B).

Plain-number component tokens: we count **15** in the Components collection, not 32. Send us your list if yours differs.
- **11 are now aliases:** Input Min Width S/M/L, Multiselect Min Width, Multiselect Badge Min Width, Card Image Height, Card Min Width, Tag S Min Height, Textarea Min Height S/M/L. A new `- Size -/200` was added for Input L.
- **4 stay plain numbers on purpose:**
  - `Buttons/Global/Standard Min Width` = 0
  - `Avatar Group/Gap` = −12 (the overlap)
  - `Date Picker/One Calendar Min Width` = 308
  - `Data Table/Global/Min Width` = 93

---

## Part B — fixed in Figma so far

**Orphan / stale bindings: all five rebound to local tokens**
- Checkbox M check icon → `-- Atoms/Selection Control/Global/Size M`
- Bottom Line Input Items Gap → `-- Molecule/Input/Bottom Line/Size {S|M|L}/Items Gap`
- Bottom Navigation dot → new `--Organism/Bottom Navigation Bar/Dot Size` (→ `- Size -/12`, width and height)
- Split Button L Icon button height → `-- Atoms/Buttons/Split Button/L/Height`. Icon Only L now binds `-- Atoms/Buttons/Icon Only/L/Height`. Both stay 48.
- Progress Bar track stroke → `-- Atoms/Progress Bar/Global/Border Weight`

**More orphans found on the way, also fixed**
- `-- Molecule/Input/Global/General/Min Width` (missing variable) on all Input wrappers → `-- Molecule/Input/Global/Size S|M|L/Min Width`, matched by value
- `-- Molecule/Input/Text area/Size S|M/Items Gap` (missing) → new `-- Molecule/Input/Textarea/Size S|M/Items Gap`. This also answers "only Size L has Items Gap".
- `opacity/disabled` on Stepper, Textarea and FAB was an old variable from outside the system. It's now `- opacity -/disabled`. So yes, these were two different variables; now there is one.

**Bindings to another component's tokens**
- List Item Label Helper Gap → new `-- Atoms/List Item/Label Helper Gap` (→ `- Spacing -/04`)
- Thumbnail Circle BG radius → `-- Atoms/Thumbnail/Global/Radius Circle`
- Stacked List Default trailing button width → `Default/Item Size`

**Other fixes**
- `.Focus-ring` master stroke is now bound to `- Border Weight -/thick` (2px)
- Checkbox Success unchecked stroke → `status/success/border` (all 8 variants)
- Progress Bar Value=100 Size=S fill radius → `Size S/Radius`
- Avatar and Thumbnail status-dot height now follow the same per-size token as the width
- Avatar property `ShowStatus` → `Show Status`
- Knob: `Disabled` values `off/on` → `Off/On`; Pressed handle stroke bound to `- Border Weight -/thin`; single-child `itemSpacing` unbound on the disabled variant
- Data Table: `Empty3` was an unused duplicate of `Empty=Off` and has been removed. The unused duplicate `_Table Cell` set (0 instances) has been removed; the one in use stays.
- Typos:
  - "ScollBar" → "ScrollBar"
  - "Organsim" → "Organism"
  - "Sellect all" → "Select all"
  - "Allow Acces" → "Allow Access"
  - "Area dublu" → "Area double"
  - "arive" / "ariving" → "arrive" / "arriving"
  - "Budapesta" → "Budapest"
  - Stacked List tier label → "ORGANISMS"

---

## Part B — round 2

Rules we applied:
- Where a token and a layer disagree, **the token wins**.
- Where you fixed contrast or states in code, **Figma follows your code**.

### Colour changes (these reach the code through the tokens)
- **Accent ramp, both modes:**

  | Token | Light | Dark |
  |---|---|---|
  | `accent/default` | primary/600 (unchanged) | primary/400 → **600** |
  | `accent/hover` | primary/300 → **700** | primary/700 (unchanged) |
  | `accent/active` | primary/700 → **800** | primary/300 → **800** |

  White `text/on-accent` on these is now 6.3 / 7.9 / 9.9 : 1. This fixes the Button family, FAB, List Item, Pin, Segmented, Avatar, Date Picker day hover/pressed, Tabs hover/pressed and Pagination pressed.
- **Texts and icons that were coloured with `accent/*`** (about 1,200 layers) now use `text/accent`. Non-icon strokes on `accent/default` now use `border/accent`; this covers Icon Only Secondary. In light mode nothing visible changes. In dark mode they stay readable on dark surfaces.
- **`text/secondary`:** Light neutral/500 → **600**, Dark neutral/400 → **300**.
- **`text/muted`:** Light neutral/600 → **500** (Dark stays 400). Muted was darker than secondary; now it's the other way round. This fixes Segmented inactive label, Tag Outline, Switcher resting label and Tabs Full active.
- **New:** `overlay/scrim` (black 50%).

### Contrast fixes on masters (all match your code)
- **List Item:** Pressed label → `text/on-accent`; hover helper text → `text/primary`.
- **Entity Card:** chevron on hover / pressed → `text/on-accent`.
- **Pagination:** hover number → `text/on-accent`; `.Pagination Content` stroke → `border/default`.
- **Date Picker range Middle:** Hover / Pressed text → `text/on-accent`. The Pressed band is now `overlay/pressed`.
- **Time Picker:** AM → `text/secondary` at `- opacity -/dim`. The centre value is `text/accent`: 4.8 : 1 in dark.
- **Spinner:** Inverse % label → `text/on-accent`.
- **ScrollBar:** thumb → `neutral/subtle`.
- **Tag:** overlay opacities → `- opacity -/hover` / `- opacity -/pressed`.

### Tokens that were bound nowhere: now bound
- **Toast:** tone icons → `Icon Size` (32). New `Toast Snackbar/Content Gap` (→ `- Spacing -/10`).
- **Action Bar:** `Button Min Width` on the buttons.
- **Avatar Group:** `Counter Size` on the counter.
- **Entity Card:** `General Gap`.
- **Range:** knob frame → `Tooltip Knob Gap`.
- **Item List:**
  - `Gap` is bound on the rows slot and **set to `- Spacing -/04`** (your 4px).
  - `Divider Stroke` is bound on the Divider.
- **Date Picker:** `Footer/Padding X / Y` (16 / 12).
- **Widget Card:**
  - New `Card/Base/Border Weight` (thin), bound on all `_Card` / `_Media Card` variants.
  - `Header Gap` bound.
  - `Body Gap`, `Action Radius` and `Action Padding X` now alias semantics instead of primitives.
- **Bottom Sheet:** builder gap → `General Gap` (24).
- **Top Bar:** the Background opacity token is bound on every variant. Mobile Standard's raw blur → `effect/blur/md`.
- **Side Bar:**
  - New `Side Bar/Background opacity` (same 20%).
  - Same `effect/blur/md` as the Top Bar.
  - The toggle is now a Ghost S Icon Only Button (`li:panel-left`).
- **Bottom Navigation:** new `Items Gap` (→ `- Spacing -/10`) bound on the items slot.

### States
- **New `Focused` boolean + `.Focus-ring`** (same pattern as Icon Only Button) on:
  - `.Segmented control-item`
  - `_Internals / Tab Item` (30 variants)
  - `.Switcher Item`
  - `_Nav Item`
- **Disabled = opacity only:**
  - Icon Only: no fill swap, no second icon dim.
  - Button Link: keeps the tone colour.
  - Checkbox: keeps the stroke.
  - FAB: Default look at `- opacity -/disabled`.
- **Radio and Switch** now have `Disabled=Off|On`.
- **FAB** has a Hover state (`accent/hover`). Its menu labels use `text/secondary` instead of `Palette/neutral/500`.
- **Tabs Full** disabled variants are bound to `- opacity -/disabled`.
- **Switcher:**
  - Hover / Pressed fill → `neutral/subtle` (no longer the container colour).
  - Active shadow → `effect/shadow/down/sm`.
- **Close controls** on `_Card` and the Bottom Sheet builder are now Ghost S Icon Only Buttons (`li:x`) instead of loose vectors.

### Smaller ones
- Range `Show Tooltip` now defaults to off.
- `.Status-avatar` renamed `.Status-dot`.
- Dialog doc icon name → `li:map-pin-plus-inside`.
- Top Bar / Side Bar doc tier labels and "This organism" corrected.

## Part B — round 3

### Focus model (property API change)
- **Button, FAB (`_FAB options`), Button Link and Tag:** `State=Focused` is gone. Each set now has a `Focused` boolean plus a hidden `.Focus-ring`, the same pattern as Icon Only Button. The two instances that used `State=Focused` (one Link, one Tag) were moved to `State=Default` + `Focused=true`.
  - If your code mirrors the Figma API, drop `Focused` from `State` on these four.
- **Split Button and `.Pagination Button`:** the ad-hoc "Focus" rectangles are now `.Focus-ring` instances, with the same position and the same `Focused` binding.
- **Checkbox:**
  - The malformed wrapper ring and the wrapper's duplicate `Focused` were removed.
  - The inner `.Checkbox-options` ring is now sized at −3 around the box. It's exposed on the wrapper, so `Focused` is set there.
  - Radio and Switch inner options are exposed the same way.
- **List Item:** rings at −3 with STRETCH and `-- Atoms/List Item/Radius`.

### Inputs
- **Focus = the field's own border.**
  - The hidden 1px `.Focus-ring` instances (81) and the `Focused` boolean were removed from all six option sets.
  - `State=Active` is the focused / typing state: `border/focus` at `- Border Weight -/thick` (2px).
- **Hover and Pressed:** `border/hover` with no wash on every input. The state layer is at `- opacity -/none`, same as your code.
- **Select and Multiselect:** `State=Disabled` → `Disabled=Off|On`, like the other inputs.
- **Multiselect:** the single-value `Expanded` property is removed. Chips use Badge **Default**.
- **Placeholders** (all inputs + Search Bar): S `Caption/300` (12), M `Body/SM/300` (14), L `Body/MD/300` (16). The system has no Regular (400) weight, so Light (300) is the closest.
- **Stepper:** title is `Body/MD/700` at every size, like the other inputs. The number is `text/primary`.
- **Bottom Line:** `Size S|M/Padding` renamed to `Padding X`, matching L.

### Selection Controls
- **Unchecked Hover / Pressed** (Checkbox + Radio) are now light tints, so unchecked never reads as checked:
  - Default validation: `accent/surface` / `accent/subtle`
  - Other validations: `status/*/subtle`
- **Labels:** all three wrappers use `Body/SM/300`. The control is top-aligned with the label.
- **Switch S Pressed knob stroke:** `border/accent`, same as M.

### List Item
- Disabled variants now have the Level 1 / Level 2 spacers, so nested disabled rows keep their indent.

### More components
- **Tooltips:** `Position` now names the side the tooltip opens on (old Bottom → Top, Top → Bottom, Left → Right, Right → Left). Instances keep their look; only the names changed.
- **User:** `Global/Text Gap` / `Item Gap` now alias `Entity Item/Label Gap` / `Gap`, so the two can't drift.
- **Tabs:** Active label → `text/primary`. The Underline active indicator is now 2px (`- Border Weight -/thick`).
- **Entity Card:** Collapse=On is a centred 56 × 56.
- **Side Bar:** nav rows in the body slot don't show the trailing chevron. Sub Header slot set to FILL.
- **Bottom Navigation:** the More list hugs its content (was FIXED 136).
- **Pagination:** new `Type=Ellipsis` on `.Pagination Content` ("…", `text/muted`, 32px slot).
- **Thumbnail:** new `Show Status` boolean (default off) drives the status dot.
- **Toast:** new `Show Dismiss` boolean (default on): a Ghost S Icon Only Button with `li:x`.
- **Item List:** `effect/shadow/down/md`, so the floating list lifts.
- **Dialogs:** Danger (both types) and Vertical Warning titles are centred like the rest.
- **Form Groups:** Size M Action Bar is Horizontal. Size S Action Bar fills the group (no overflow).
- **Top Bar Mobile Standard:** the Content frame fills (no 16px overflow).
- **Time Picker:** Period spacer texts use the same text style as AM / PM.
- **Content Blocks:** placeholder icon strokes → `text/muted`.
- **Docs:** Item List and Search Bar colour names now match the masters.

### New tokens
- **Chart colours** (Colors collection, both modes):
  - `chart/series-1…5` → accent, success, warning, danger, info
  - `chart/grid` → `border/muted`
  - `chart/heat-100…900` → `Palette/primary/*`

  Every Stats Card chart and legend now uses these (739 layers), so a theme can recolour charts without touching the accent. This replaces the `border/accent` stopgap from round 2.
- **`- opacity -/faint`** (→ `opacity/30`), used by the empty rating stars in Data Table.

## Still open

**Decided: one surface colour for the bars.** Top Bar (Desktop + Mobile floating) and Side Bar backgrounds now use `bg/surface` instead of `bg/brand`, still at the Background opacity token (20%). That matches the Mobile Standard Top Bar and Bottom Navigation, so all the translucent bars share one colour.

**One design call, waiting on Max:**
- **Data Table cell lines:** body uses `border/default` and the header uses `border/muted`. Keep?

**Not done yet:**
- **Search Bar:** hover / focus / disabled states; the button's hand-resized width.
- **Date Picker:** proper empty-cell variant; Input pane border; month + year header.
- **Range:** Disabled.
- **Spinner:** ring tokens that never render; "100%" overflow at XL.
- **Progress Bar:** child layer names.
- **Dropdown:** list alignment; unresolved preferred values.
- **Item List:** Multiselect list offset (4 vs 8).
- **Form Groups:** `Items2` slot.
- **Top Bar:** gradient stroke; plain 44px buttons; raw shadows and stray square on the floating Search button.
- **Side Bar:** collapsed paddings; logo clipping.
- **Bottom Navigation:** dot offsets.
- **Stacked List:** Media radius; trash icon 26; `_Share Item` Type axis.
- **Widget Card:** footer gap.
- **Bottom Sheet:** Padding Y; premade copy.
- **Pin:** avatar stroke.
- **Time Picker:** Period Bottom Padding; Hover spec.
- **Tooltips:** max width.
- **Divider:** vertical variant.
- **Inputs:** Secondary variant on all inputs.
- **Content Blocks:** doc frame and descriptions.
- **Remaining doc-text fixes:** Knob, ScrollBar, Time Picker, Status Dot, Split Button, Pin, Top Bar Mobile, Side Bar.

The Toast / Stacked List strokes at weight 0 stay on purpose. Their Border Weight token is `none`, so a theme can switch borders on.
