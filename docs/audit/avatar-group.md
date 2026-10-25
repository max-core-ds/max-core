# Audit — Avatar group page (Phase 4.5)

- **Figma page:** Avatar group `2177:1782`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Avatar group `2177:1795` (standalone COMPONENT; `Show Counter` BOOLEAN default true, `Slot` SLOT accepting Avatar; 4 instances)
- **React:** `AvatarGroup` (data-driven `avatars[]` + `max` → +N counter)
- **Audited:** 2026-10-25, via a read-only `use_figma` read of the master, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Show Counter → the counter appears when `max` hides avatars. Slot → `avatars[]` [deviation, kept: data-driven, so the +N is computed]. ❌ Default size was M; the master's avatars are **XS** → **[code]** default `xs` (any size still allowed, as the slot accepts any variant). |
| 2 | States | n/a (not interactive). |
| 3 | Colours | ✅ Separator `border/surface`; counter = Avatar Type=Text (`accent/default` + `text/on-accent`; dark 2.85, the known accent-ramp finding under Avatar). |
| 4 | Dimensions | ❌ The separator was `ring-1`, an **outside** 1px shadow (26px circles); the master's stroke is **INSIDE** (Border Weight thin) → **[code]** an inset outline (`outline-offset: -1px`), circles stay 24. ✅ Gap −12 (raw, the token is a negative direct value); Avatars Radius full (now bound on each item). Rendered 72 × 24 with four avatars + counter = master. |
| 5 | Typography | ✅ Counter Caption/700 (Avatar XS). |
| 6 | Anatomy | ✅ Later avatars on top (DOM order = Figma stacking); counter last. The wrapper divs were dropped (the classes sit on the Avatars). |
| 7 | Focus | n/a. |
| 8 | A11y | ❌ The counter read as "+2" → **[code]** visible `+N` is `aria-hidden`, screen readers get "N more". Avatars keep their own alt. |
| 9 | Doc page | ✅ 4 tokens + chains. ❌ `Counter Size` (24) is documented but unbound: the counter's width binds `-- Atoms/Avatar/Size XS/Size` → [designer]. React sizes the counter like the other avatars. |
| 10 | Story | ❌ Default size M → XS. Default + WithOverflow kept (`max` shows the counter). |

## Code fixes applied
1. Default size `xs`.
2. Inside 1px `border/surface` separator (inset outline) instead of an outside ring; Avatars Radius bound.
3. Counter accessible name "N more".

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright light + dark: 24px avatars, outline 1px / offset −1px in `#FFFFFF` / `#1E293B`, −12 overlap, 72 × 24 with counter.

## For the designer (→ PROGRESS.md)
- `-- Molecule/Avatar Group/Counter Size` is bound nowhere (the counter uses Avatar XS Size); bind it or drop it.
