# Audit — Buttons page (Phase 4.5)

- **Figma page:** Buttons `7:16`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Button `119:5296` / .Button-options `11:146` · Icon Only Button `3311:14619` / .Icon-Only-Options `19:4462` · Split Button `7145:412` / .Split-Button-Option `7145:430` · FAB `7145:12327` / _FAB options `7145:12348` · Button Link `19:5415`
- **React:** `Button`, `IconOnlyButton`, `SplitButton`, `Fab`, `LinkButton` (+ `utils/state-layer.ts`, `utils/focus-ring.ts`, `utils/tone.ts`)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads (ground truth) and the doc-page text
- **Contrast baseline:** 12/23 components, 13 findings (unchanged). Buttons family: only `Fab` fails (`text/on-accent` on `accent/default`, dark 2.85). This is the known dark accent ramp issue, Figma-side.

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** fix in React · **[designer]** Figma-side · **[deviation]** deliberate, with reason.

---

## Shared (whole family)

| Area | Finding | Class |
|---|---|---|
| Dimensions | ✅ Every padding/gap/height/icon size/radius per size matches `-- Atoms/Buttons/*` (Standard, Icon Only, Split, Fab, Link). | — |
| States | ✅ Hover = `overlay/state layer` @ `opacity/hover` (0.2) + `shadow/down/lg`. Pressed = @ `opacity/pressed` (0.35) + `shadow/down/sm` + 2px press-down. Disabled = wrapper @ `opacity/disabled` (0.4). React `stateLayer` + `elevatePress` mirror this. | — |
| Focus | ❌ Figma has **three** focus mechanisms. Button and Split wrapper: ad-hoc `Focus` rect, `border/accent` **1px INSIDE**. Icon Only, FAB, Link and the Split inner: `.Focus-ring`. Button, FAB and Link model Focused as a **State value**; Icon Only and Split use a BOOLEAN. | [designer] |
| Focus | ❌ The `.Focus-ring` master (`24:797`) stroke is **1px, unbound**, but its description says `- Border Weight -/thick` (2px). React `focusRing` = 2px `border/focus`, offset 2. **Recommend keeping 2px in React**, and the designer binds the master stroke to `/thick`. | [designer] |

## Button (`Button` ↔ Button + .Button-options)

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ variant/tone/size + left/right icon ↔ Variant/Tone/Size + Show Left/Right Icon + swaps. `Show Label` = omit children. |
| 2 | States | ✅ (see Shared) |
| 3 | Colours | ❌ **Secondary has no fill in Figma** (doc and master both say "Fill: —"). React adds `bg-[var(--bg-surface)]`. → **[code]** make it transparent like Figma, **or** [deviation] keep the surface fill (reads as a solid chip on tinted backgrounds). Needs a decision. All other fills, strokes and labels ✅. |
| 4 | Dimensions | ✅ |
| 5 | Typography | ❌ **One step too large at M/L/XL.** Figma: S `Caption/700` (12), **M `Caption/700` (12)**, L `Body/SM/700` (14), XL `Body/MD/700` (16). React: xs/**sm/base/lg**. → **[code]** S/M `text-xs`, L `text-sm`, XL `text-base`. |
| 6 | Anatomy | ✅ State Layer · left icon · label · right icon |
| 7 | Focus | React ✅ (`focusRing`, pressable). Figma ❌ (`Focus` rect + State=Focused, see Shared) [designer] |
| 8 | A11y | ✅ native `<button>` via Base UI; Primary contrast passes |
| 9 | Doc page | ✅ The colour mapping matches the master. ❌ Minor: `.Button-options` radius binds `Global/Radius` at S/L/XL but `Standard Button/M/Radius` at M (same value, inconsistent binding). The State Layer binds the primitive `Grayscale/Black` in the inner set (the wrapper overrides it with `overlay/state layer`). [designer] |
| 10 | Story | ✅ Controls cover every axis; AllVariants/IconsAcrossSizes matrices |

## Icon Only Button (`IconOnlyButton`)

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ variant/tone/size/icon. `aria-label` is required (React-only, correct). |
| 2 | States | ❌ **Figma Hover/Pressed have no elevation** (state layer only, no shadow, no press-down). React applies `elevatePress`. → **[code]** drop `elevatePress` (keep `stateLayer`), **or** [deviation] keep it for family consistency. Needs a decision. ❌ Figma Disabled swaps the fill to `bg/subtle` and dims the icon a second time (0.4 × 0.4). This breaks the "disabled = opacity only" rule. React is correct → [designer]. |
| 3 | Colours | ❌ Secondary stroke = `accent/default` here, but `border/accent` on Button. React uses `border/accent` for both. Primary status tones stroke `status/*/border` @ 0px (no visual effect). [designer] for consistency. ❌ Secondary has no fill (same as Button) → follows the Button decision. Icon colours ✅. |
| 4 | Dimensions | ✅ |
| 5 | Typography | n/a |
| 6 | Anatomy | ✅ |
| 7 | Focus | ✅ `.Focus-ring` + Focused BOOLEAN in Figma, React `focusRing`. Only the 1px/2px question remains (Shared). |
| 8 | A11y | ✅ |
| 9 | Doc page | ✅ matches the master |
| 10 | Story | ✅ |

## Split Button (`SplitButton`)

| # | Area | Status |
|---|---|---|
| 1 | API | ❌ **Figma has `Type` = Primary/Secondary only, with no Ghost and no Tone.** React exposes `variant` (incl. `ghost`) × `tone`, which are invented axes. → **[code]** narrow to `variant: 'primary' \| 'secondary'` and drop `tone` (breaking), **or** [deviation] keep them as a superset. Needs a decision. |
| 2 | States | ✅ independent Main/Icon hover + pressed (state layer per part), disabled 0.4. Figma has no elevation on Split, and neither does React ✅. |
| 3 | Colours | ❌ **Divider:** Figma `border/default` 1px, **Primary only**. Secondary has no Divider: each half has its own `border/accent` stroke, which forms the seam. React: `bg-current opacity-30` on both. → **[code]** Primary divider `bg-[var(--border-default)]`. Secondary: full-height `border/accent` seam, no 30% line. ❌ Secondary has no fill (follows the Button decision). |
| 4 | Dimensions | ✅ Height/padding/icon/divider height per size. ❌ Figma Size=L Icon button height binds a **stale legacy token `Atoms/Buttons/IconOnly/LG/Height`** (Components collection, no `--` prefix) [designer]. |
| 5 | Typography | ❌ Same as Button. S/M `Caption/700`, L `Body/SM/700`, XL `Body/MD/700`. React is one step too large → **[code]**. |
| 6 | Anatomy | ✅ Main button · Divider · Icon button (chevron) |
| 7 | Focus | ❌ **[code] bug:** each part has `focusRing` (outset box-shadow), but the container is `overflow-hidden`, so the ring is **clipped** on the outer edges. → round the parts individually (`rounded-l` / `rounded-r`) and drop `overflow-hidden`. A per-part ring is a deliberate choice: two tab stops, and the ring shows which half has focus. Figma ❌: two mechanisms (wrapper `Focus` rect `border/accent` INSIDE, bound to Focused, plus a hidden `.Focus-ring` in the inner set) [designer] |
| 8 | A11y | ✅ The trigger has `aria-label`, and Base UI Menu provides keyboard support. |
| 9 | Doc page | ❌ The doc says the focus ring is "`border/focus` … full-width rectangle behind", but the wrapper rect binds `border/accent` INSIDE [designer] |
| 10 | Story | ✅ (update argTypes if the API narrows) |

## FAB (`Fab`)

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ size S/M/XL, icon, speed-dial `actions` ↔ Expanded + 3 Item slots (label on/off, text, icon). React has no per-item "label off" (omit label → see A11y). |
| 2 | States | ❌ Figma `_FAB options` State = Default/Pressed/Disabled/Focused: **no Hover**. Pressed = fill swap to `accent/active` (not a state layer). Disabled = fill swap to `bg/surface` + 0.4. Shadow stays `down/md` in every state. React: state layer + `elevatePress` + opacity → [deviation] (family-consistent, follows the disabled = opacity rule). The designer should add Hover and move to the state-layer model [designer]. |
| 3 | Colours | ❌ **Menu items:** Figma item circle = `accent/default` + `text/on-accent` icon + `shadow/down/md`. React = `bg/surface` + `text/primary` + `shadow/down/sm` → **[code]**. ❌ **Item label:** Figma `bg/surface`, **no shadow**, text `Caption/700` in `Palette/neutral/500` (a primitive, not mode-aware; it equals `text/secondary` in light). React: `text-sm` bold `text/primary` + shadow-sm → **[code]** `text-xs` + `text/secondary`, no shadow. The primitive binding is [designer]. Main button ✅. |
| 4 | Dimensions | ✅ Main size/icon, Expandable Gap 16, List Gap 16, Item Gap 8, Label padding 8/4, Item 40 / icon 20 |
| 5 | Typography | ❌ Label (see 3) |
| 6 | Anatomy | ✅ Items stacked above main, label left of the item circle |
| 7 | Focus | React ✅. Figma: `.Focus-ring` ✅ but Focused is a **State value** (should be a BOOLEAN) [designer] |
| 8 | A11y | ❌ **[code] bug:** speed-dial item buttons have **no accessible name**. The label `<span>` is a sibling, not associated. → `aria-label` / `aria-labelledby` on each item. Also: the menu doesn't close on Escape or outside click, and the main button has no `aria-controls` → **[code]**. Contrast: known dark-mode `on-accent`/`accent` failure (Figma ramp). |
| 9 | Doc page | ✅ matches the master |
| 10 | Story | ✅ Default / Sizes / SpeedDial |

## Button Link (`LinkButton`)

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ tone + icon. ❌ Figma has a single `icon` (right side, Show Icon). React has left + right icons → [deviation] (harmless superset). |
| 2 | States | ✅ default → hover → active colour walk per tone. Hover in Figma = bottom stroke `accent/hover`, React = `hover:underline` → [deviation] (equivalent, and text-decoration is the web idiom). ❌ Figma Disabled label = `text/primary` + 0.4 (colour swap). React keeps the tone colour + 0.4 (opacity-only rule) → [designer]. |
| 3 | Colours | ✅ |
| 4 | Dimensions | ✅ Padding 4, Gap 8, Icon 20, Focus Radius sm |
| 5 | Typography | ✅ `Body/MD/300` = `text-base font-light` |
| 6 | Anatomy | ✅ |
| 7 | Focus | React ✅. Figma: `.Focus-ring` ✅ but Focused is a **State value** [designer] |
| 8 | A11y | ✅ |
| 9 | Doc page | ✅ |
| 10 | Story | ✅ |

---

## Resolution (reviewed with the user 2026-10-24)

**Decisions:** **A** Secondary → transparent, like Figma. **B** IconOnly keeps
`elevatePress` (deliberate deviation, commented in code). **C** SplitButton keeps
`ghost` + `tone` as a deliberate superset (commented in code).

**Code fixes applied:**
1. Typography: Button + SplitButton S/M `text-xs`, L `text-sm`, XL `text-base`.
2. Secondary `bg-transparent` on Button, IconOnlyButton, SplitButton.
3. SplitButton: no `overflow-hidden`. The parts round their own outer corners, and the focused part is lifted (`focus-visible:z-10`), so the ring is no longer clipped. Divider: Primary `border/default`; Secondary is a full-height seam inheriting the tone border; Ghost keeps the faint current-colour line.
4. Fab menu: item = `accent/default` + `text/on-accent` + `shadow/down/md`. Label = `text-xs` bold `text/secondary`, no shadow.
5. Fab a11y: items are named by their label (`aria-labelledby`), the main button has `aria-controls`, and the menu closes on Escape and outside pointer-down.
6. Contrast audit: the Button family was only covered by accident (it paired `text/primary` with the Secondary `bg/surface` fill that was just removed, and that pairing was never what renders). It now declares the real pairings (`buttonFamily` override). This surfaces 2 dark-only findings per component (`on-accent` on `accent/default` 2.85 and on `status/danger/default` 2.90), with the same root cause as the known dark accent ramp → **new baseline: 19 findings in 15/23 components** (was 13 in 12; no regression, only coverage).

**Verified:** typecheck, build, Storybook tsc, drift ✅. Playwright screenshots (light and dark): Button matrix, Split primary/secondary, Split keyboard focus (ring unclipped), Fab speed dial (open, Escape closes, items announce their labels).

## For the designer (→ PROGRESS.md)
- Unify focus on `.Focus-ring` with a Focused BOOLEAN: Button (`Focus` rect + State=Focused), Split wrapper (`Focus` rect, `border/accent` INSIDE), FAB and Link (State=Focused). Bind the `.Focus-ring` master stroke to `/thick` (2px), as its description already says.
- Icon Only disabled: drop the `bg/subtle` fill swap and the second icon dim. Use opacity only.
- Icon Only Secondary stroke `accent/default` → `border/accent` (match Button).
- FAB: add a Hover state, move Pressed and Disabled to the state-layer and opacity model, and change the item-label text from `Palette/neutral/500` to `text/secondary`.
- Link disabled: keep the tone colour (opacity only).
- Split L Icon button height: rebind from the stale `Atoms/Buttons/IconOnly/LG/Height` to `-- Atoms/Buttons/Split Button/L/Height`, then delete the orphan.
- Split doc text: the focus-ring description doesn't match the master.
- .Button-options: consistent radius binding (S/L/XL `Global/Radius` vs M per-size). The inner State Layer binds the primitive `Grayscale/Black`.
