# Audit — User card page (Phase 4.5)

- **Figma page:** User card `2011:669`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Entity Card `2011:1645` (COMPONENT_SET: `State` Default / Active / Hover / Pressed × `Collapse` Off / On; `Right Icon` BOOLEAN default true, `Focused` BOOLEAN; 5 instances in the file)
- **React:** `EntityCard` (a `<button>` wrapping an `EntityItem`)
- **Audited:** 2026-10-25, via a read-only `use_figma` read of the set, its nested instances, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ❌ **Right Icon** (Icon Only Button Ghost S, `chevron-down`, default on) had no equivalent → **[code]** `chevron` (default `true`). Rendered as a decorative 32px box + 20px icon, not a nested button (the whole card is the trigger). ❌ **Collapse** had no prop → **[code]** `collapsed` (falls back to the rail context like EntityItem; hides labels + chevron, avatar-only square) and the card hands the resolved state to the nested EntityItem. ✅ State → CSS + `active`; Focused → `:focus-visible`. |
| 2 | States | ✅ Hover `overlay/hover`, Pressed `overlay/pressed`, Active `accent/subtle`. ❌ The pressed text colour never reached the title: EntityItem's title sets `text/primary` itself, so `active:text-…` on the button did nothing (light pressed = 2.2:1) → **[code]** the title inherits the card colour. |
| 3 | Colours | Figma: Default / Active title `text/primary`; Hover / Pressed `text/on-accent`; chevron `accent/default` in every state. **[deviation, kept from the contrast fix]** hover keeps `text/primary` (white on the light `overlay/hover` is ~1.9:1); pressed uses `text/on-accent-muted` (mode-aware). **[deviation, new]** the subtitle and the chevron follow the card colour on hover / pressed: `text/secondary` ~2.9 and `accent/default` ~1.2 on the washes. |
| 4 | Dimensions | ✅ Padding X / Y 12, gap 8, radius none; height 56 (Avatar S 32 + 24) = master. Collapsed: React 56 × 56 square; master is FIXED 64 with SPACE_BETWEEN, so its single avatar sits left, not centred → [designer]. |
| 5 | Typography | ❌ The card overrides Entity Item's Username to **Body/SM/700** (14) → **[code]** a User EntityItem's title is `text-sm` inside the card (`data-entity-title` hook). A Workspace item keeps Body/LG (no card master uses it). |
| 6 | Anatomy | ✅ Entity Item (Avatar S, Show Subtitle off) → chevron at the end (SPACE_BETWEEN = `justify-between`). |
| 7 | Focus | ✅ `focusRing` (pressable). Figma: `.Focus-ring` at `- Border Weight -/thin` (1px), the hybrid model says 2px → [designer]. |
| 8 | A11y | ✅ Native button; chevron `aria-hidden`. Consumers add `aria-haspopup` / `aria-expanded` when it opens a menu. Contrast audit: EntityCard ✓. |
| 9 | Doc page | ✅ 4 tokens + chains. ❌ `General Gap` is documented but the card's `itemSpacing` is unbound (8 hard) → [designer]. |
| 10 | Story | ❌ Avatar M + subtitle; master = Avatar S, no subtitle → fixed. Controls for `active` / `chevron` / `collapsed`; new **Workspace** story (switcher trigger). Active story dropped (a Control). |

## Code fixes applied
1. `chevron` (Right Icon) + `collapsed` (Collapse, rail-aware) props.
2. Title Body/SM/700 inside the card and inherits the state colour (pressed text colour was dead).
3. Subtitle + chevron follow the card colour on hover / pressed (contrast).
4. EntityItem: `data-entity-title={type}` / `data-entity-subtitle` hooks.
5. Stories: Avatar S, no subtitle; Workspace story.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright light + dark: 320 × 56 card, title 14/700; hover `#A5B4FC` / `#4338CA` + title `#0F172A` / `#F8FAFC`; pressed `#4338CA` / `#A5B4FC` + title, subtitle and chevron `#F1F5F9` / `#1E293B`; collapsed + active 56 × 56 `accent/subtle`; outset focus ring visible in both themes.

## For the designer (→ PROGRESS.md)
- Hover / Pressed title `text/on-accent` fails in light hover (~1.9) and dark pressed; the chevron stays `accent/default` on the washes (~1.2). React: hover `text/primary`, pressed `on-accent-muted`, chevron + subtitle follow the text.
- `-- Molecule/Entity Card/General Gap` is unbound (card gap 8 hard-coded).
- Collapse=On is 64 wide with the avatar left-aligned (SPACE_BETWEEN with one child); make it a centred 56 square.
- `.Focus-ring` 1px (`/thin`); the focus model wants 2px.
