# Audit — Pin page (Phase 4.5)

- **Figma page:** Pin `2080:24931`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Pin `2080:24877` (COMPONENT_SET: `Type` Icon / Avatar; `Icon instance` INSTANCE_SWAP, default `li:user`; 5 instances)
- **React:** `Pin` (circle + tail, content as children)
- **Audited:** 2026-10-25, via a read-only `use_figma` read of the set, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ❌ **Type** had no prop; one style served both → **[code]** `type: 'icon' \| 'avatar'` (default icon). Icon instance → `children` (an icon); Type Avatar → `children` = `<Avatar size="m">`. |
| 2 | States | n/a (not interactive). |
| 3 | Colours | ❌ Icon type had a 2px `border/accent` border the master doesn't have → **[code]** removed: plain `accent/default` circle, icon `text/on-accent`. ❌ Avatar type: the master rings the Avatar with **`border/accent`** 2px INSIDE → **[code]** inset outline on the Avatar. ❌ Tail was `border/accent` → **[code]** `accent/default` (the Pin Vector / Pin Tail stroke). Contrast: icon `text/on-accent` on `accent/default` dark 2.85 (the known accent-ramp finding, already counted). |
| 4 | Dimensions | ✅ Size 40, Padding 4, Radius full. ❌ Icon inherited lucide's 24px; the master's icon is **32** → **[code]** `[&_svg]:size-32`. ✅ Tail = Stroke Weight (thick 2) × 20, now round-capped (`cap=ROUND`), was square. |
| 5 | Typography | n/a (the old WithInitials story put text in the Icon type, which the master doesn't have; dropped). |
| 6 | Anatomy | ✅ Circle → tail, gap 0, centred. Figma's 1–4px root padding only makes room for the round caps / ring. |
| 7 | Focus | n/a. |
| 8 | A11y | ✅ Tail `aria-hidden`; the icon / Avatar carry their own label. |
| 9 | Doc page | ✅ 5 tokens + chains. ❌ `Avatar Stroke Weight` is documented but the Avatar's 2px stroke is unbound → [designer]. Doc says colours come from `accent/default, bg/surface`; the master uses `accent/default`, `border/accent`, `text/on-accent` (no `bg/surface`) → [designer]. |
| 10 | Story | ❌ Shadow `shadow/down/md` on the circle isn't in the master → **[code]** removed. Stories: Icon (`li:user` → lucide `User`), WithAvatar (`type="avatar"`); WithInitials dropped. |

## Code fixes applied
1. New `type` prop (Figma Type).
2. Icon type: no border, no shadow, 32px icon. Avatar type: inside 2px `border/accent` ring on the Avatar.
3. Tail `accent/default`, round end, token height / width.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright light + dark: 40 × 60 pin, icon 32 `#F8FAFC` on `#4F46E5` / `#818CF8`; avatar outline 2px / −2px `border/accent`; tail 2 × 20 `accent/default`.

**Gotcha:** an outline on a wrapper is painted *under* a `position: relative` child (the Avatar root), so the ring was invisible until it moved onto the Avatar itself (`[&>*]:outline-…`).

## For the designer (→ PROGRESS.md)
- `-- Molecule/Pin/Avatar Stroke Weight` is unbound (the Avatar's 2px stroke is hard-coded).
- Doc page lists `bg/surface` as a Pin colour; the master uses `accent/default`, `border/accent`, `text/on-accent`.
