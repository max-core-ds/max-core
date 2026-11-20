# Audit — User page (Phase 4.5)

- **Figma page:** User `4952:44907`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** User `5015:380` (standalone COMPONENT; `Name` TEXT, `Subtitle` TEXT, `Show Subtitle` BOOLEAN; 6 instances in the file)
- **React:** none. Covered by `EntityItem` with an `Avatar size="m"` as `leading`
- **Audited:** 2026-10-24, via a read-only `use_figma` read and the doc-page text

**Outcome: no new component.** User is Entity Item with a fixed Avatar, so a separate `User` would duplicate it.

| User (Figma) | EntityItem (React) | |
|---|---|---|
| Avatar instance (Size M, Type Image) | `leading={<Avatar size="m" … />}` | ✅ (the `Default` story is exactly this) |
| Name, Body/MD/700, `text/primary` | `title`, `text-base font-bold`, `text/primary` | ✅ |
| Subtitle, Body/SM/300, `text/secondary` | `subtitle`, `text-sm`, `text/secondary` | ⚠️ React renders weight 400, not Light 300. Check it against the Entity Item master on that page (Molecules) before changing |
| Show Subtitle | `subtitle` omitted | ✅ |
| `-- Atoms/User/Global/Item Gap` → spacing 08 | `gap-[var(--spacing-08)]` (Entity Item Gap, also 08) | ✅ same value |
| `-- Atoms/User/Global/Text Gap` → spacing 08 | Label Gap, also 08 | ✅ same value |

Focus, states and story: n/a (no React component).

## For the designer (→ PROGRESS.md)
- User and Entity Item are the same pattern with parallel token sets (`-- Atoms/User/Global/*` vs `-- Molecule/Entity Item/*`, same values). Consider making User an Entity Item preset, or alias its tokens to Entity Item's, so the two can't drift.
