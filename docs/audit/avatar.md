# Audit — Avatar page (Phase 4.5)

- **Figma page:** Avatar `2169:5639`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Avatar `2169:5640` (Size XS/S/M/L/XL × Type Image/Text = 10 variants; `ShowStatus` BOOLEAN, `Text` TEXT)
- **React:** `Avatar` (+ `StatusDot`, audited on its own page)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads and the doc-page text

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Status |
|---|---|---|
| 1 | API | ✅ `size` xs–xl ↔ Size; Type Image/Text ↔ `src` with `fallback` (Base UI shows the fallback when there's no `src` or the image fails, which is better than a static switch); `fallback` ↔ Text. ❌ **`ShowStatus` was missing** → **[code]** new `status` (a `StatusDot` status; omitted = hidden) + `statusLabel` for its accessible name. The master always nests Type=Default; React lets you pick any status, since a presence dot that can only say "online" isn't useful. Default size stays `m` (Figma's default is XS) → [deviation], it matches the other atoms. |
| 2 | States | n/a (static). |
| 3 | Colours | ✅ Text type `accent/default` + `text/on-accent`; Image type has an image fill. The `border/default` stroke has weight Global/Border Weight = none, so nothing renders and React draws no border. The `bg/subtle` root fill only shows while an image loads (no Figma equivalent; harmless). |
| 4 | Dimensions | ✅ Sizes 24/32/40/48/64, radius full. ❌ Status dot sizes (`Size */Status Dot Size` 8/8/16/16/20) weren't used → **[code]** applied, dot pinned bottom-right (constraints MAX/MAX). |
| 5 | Typography | ✅ XS Caption/700, S + M Body/MD/700, L Heading/H6, XL Heading/H5 → `text-xs`/`text-base`/`text-xl`/`text-2xl` bold. Heading tracking (−0.5%) is ignored on two-letter initials. React adds `uppercase` (not in Figma, harmless). |
| 6 | Anatomy | ✅ Avatar BG (image or fill) + text. ❌ The root clipped (`overflow-hidden`), which would cut the status dot: in the master the dot sits on the bounding-box corner, outside the circle, and the variants don't clip → **[code]** the root no longer clips; image and fallback round themselves (`rounded-[inherit]`). |
| 7 | Focus | n/a (non-interactive) |
| 8 | A11y | ✅ Image `alt`; the status dot is `role="img"` with `statusLabel`, or decorative without it. Contrast: `text/on-accent` on `accent/default` is 2.85:1 in dark. Already in the baseline (dark accent ramp, Figma-side). |
| 9 | Doc page | ✅ 10 variants, 13 tokens, properties. ❌ The nested `.Status-avatar` height is bound to `-- Atoms/Status Dot/Size` (8) while its width is bound to `-- Atoms/Avatar/Size */Status Dot Size`. On M/L/XL it renders 16/16/20, so the height binding is overridden or wrong → [designer]. The property is named `ShowStatus` (no space, unlike `Show Range Labels` etc.) → [designer] nit. |
| 10 | Story | ✅ Controls: size, status (new); AllSizes + Initials matrices; new WithStatus story. |

## Code fixes applied
1. `status` + `statusLabel` render a `StatusDot` in the bottom-right corner, sized per `Size */Status Dot Size`.
2. The root no longer clips (so the dot isn't cut); image and fallback carry the radius.
3. `StatusDotStatus` type exported.
4. Story: status control + WithStatus.

**Contrast baseline:** unchanged, 25 findings / 16 of 24 components.
**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift (Avatar ✓, Status Dot ✓, Avatar Group ✓), biome. Playwright light + dark: WithStatus, Initials. AvatarGroup wraps each avatar in its own ringed div, so the clipping change doesn't affect it.

## For the designer (→ PROGRESS.md)
- Nested `.Status-avatar` height is bound to `-- Atoms/Status Dot/Size` (8) but renders 16/16/20 on M/L/XL. Bind height to `-- Atoms/Avatar/Size */Status Dot Size` like the width.
- Property name `ShowStatus` → `Show Status`.
