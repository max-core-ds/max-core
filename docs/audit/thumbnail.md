# Audit — Thumbnail page (Phase 4.5)

- **Figma page:** Thumbnail `2595:2477`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Thumbnail `2595:2478` (Size XS/S/M/L/XL × Type Circle/Rounded/Square = 15 variants)
- **React:** `Thumbnail`
- **Audited:** 2026-10-24, via a read-only `use_figma` bound-variable read and the doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `size` xs–xl ↔ Size; `shape` rounded/square/circle ↔ **Type** Circle/Rounded/Square. The prop stays `shape` → [deviation] (`type` reads like a media/content type; the values match Figma). Default is `rounded`/`m` (Figma: Circle/XS) → [deviation], consistent with the other atoms. `fallback` (e.g. an icon when there's no image) has no Figma counterpart; harmless. |
| 2 | States | n/a (static). |
| 3 | Colours | ✅ Image fill. The `border/default` stroke has Global/Border Weight = none, so nothing renders. The fallback's `bg/subtle` + `text/muted` is React-only. |
| 4 | Dimensions | ✅ Sizes 24/32/40/48/64 (`Global/Size *`); radii Circle full, Rounded `radius.md` (8), Square none. |
| 5 | Typography | n/a |
| 6 | Anatomy | ✅ Thumbnail BG (image, clipped to the radius). ❌ Each variant also has a hidden `.Status-avatar` instance with **no property controlling it** (copied from Avatar), so it can't be turned on from an instance → [designer]. React doesn't add a status (YAGNI; Avatar has one). |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ `<img alt>`, defaulting to `''` (decorative); pass `alt` when the image carries meaning. |
| 9 | Doc page | ✅ 15 variants, 9 tokens, radius mapping. ❌ The Circle variants' Thumbnail BG radius is bound to **`-- Atoms/Avatar/Global/Radius`**, a cross-component reference (CLAUDE.md lesson 12). It should be `-- Atoms/Thumbnail/Global/Radius Circle` (same value today) → [designer]. Size bindings are inconsistent: XS binds width + height on the component, S–XL bind height on the component and width on the BG → [designer] nit. |
| 10 | Story | ✅ Controls: shape, size; Fallback, Shapes, Sizes. |

## Code fixes applied
None. The component matches the master.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.

## For the designer (→ PROGRESS.md)
- Circle variants: BG radius bound to `-- Atoms/Avatar/Global/Radius` → rebind to `-- Atoms/Thumbnail/Global/Radius Circle`.
- Hidden `.Status-avatar` in every variant with no property to show it: remove it, or add a `Show Status` boolean.
- Size bindings: XS binds width + height on the component; S–XL bind width on the BG. Unify.
