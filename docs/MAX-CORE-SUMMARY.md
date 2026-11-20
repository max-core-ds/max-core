# Max Core Design System — Full Summary

## Overview

Max Core is a B2B end-to-end design system with 3 layers:
1. **Layer 1 — Figma DS** — tokens on 4 levels, modular components, light/dark mode
2. **Layer 2 — Plugin export JSON + WCAG audit** (in development)
3. **Layer 3 — React + Tailwind codegen** (in development)

**Figma File:** `sX5tikviuBEhNbu2iPVya5` (`Max Core`, source of truth)
**Primary Goal:** Eliminate the Figma <> Code gap. Designer changes in Figma → JSON export → UI updates automatically.

---

## Token Architecture — 4 Levels

```
Level 1 — Primitives:   #6366F1, 16px, 8px (raw values)
Level 2 — Semantic:     accent/primary, neutral/surface, status/error (aliases to primitives)
Level 3 — Component:    -- Molecule/Button/Global/Padding X (aliases to semantics)
Level 4 — Variant:      -- Atoms/Buttons/Standard-Button/Size-M/Height (aliases to component globals)
```

**Golden Rule:** Each level aliases the level above it. Zero hardcoded values in components.

---

## Token Collections

| Collection | Purpose | Token Count |
|---|---|---|
| Max Core - Primitives | Raw values (numbers, hex colors) | ~98 |
| Max Core - Semantics | Aliases to Primitives (Spacing, Size, Radius, Border Weight, Opacity) | ~55 |
| Max Core - Colors | Colors with Light/Dark mode (bg, text, accent, status, shadow) | ~106 |
| Max Core - Components | Aliases to Semantics (per-component tokens) | ~696 |
| **Total** | | **~958** |

All 958 tokens are documented with descriptions, "Used in", and "Aliased by" information.

---

## Token Naming Conventions

### Prefixes
- `--` prefix (2 dashes) = component token (Molecule, Atom, or Organism)
- `-` prefix (1 dash) = global/semantic/primitive token
- `---` prefix (3 dashes) = **OLD / WRONG** — must be replaced

### Structure
```
-- Atoms/[ComponentName]/[SubComponent]/[Property]
-- Molecule/[ComponentName]/[SubComponent]/[Property]
--Organism/[ComponentName]/[SubComponent]/[Property]
```

### Naming Rules (Post-Cleanup)
- Spaces between words: `Padding X`, `Icon Size`, `Border Weight`, `Min Width`
- Title Case on path segments: `Stacked List`, not `stacked list`
- Lowercase on semantic color tokens: `accent/subtle`, `border/accent`, `text/muted`
- No dashes in property names: `Label Gap`, not `Label-Gap`
- Size naming: `S`, `M`, `L`, `XL` (uppercase)

---

## Color System

### Modes
- **Light Mode** (default)
- **Dark Mode**

### Palette Scales (10 steps each: 50-900)
- `Palette/primary/` — Indigo (#6366F1 base)
- `Palette/neutral/` — Slate (#0F172A - #F8FAFC)
- `Palette/danger/` — Rose (#E11D48 base)
- `Palette/warning/` — Amber (#D97706 base)
- `Palette/success/` — Emerald (#059669 base)

### Semantic Colors
| Group | Tokens | Purpose |
|---|---|---|
| `text/` | primary, secondary, muted, accent, on-accent, on-accent-muted | Text colors |
| `bg/` | surface, default, subtle | Background colors |
| `border/` | default, muted, accent, focus, hover | Border colors |
| `accent/` | default, hover, active, subtle, surface | Brand/accent colors |
| `neutral/` | default, hover, active, subtle, surface | Neutral interactive colors |
| `status/danger/` | default, hover, active, subtle, border, text | Error/danger states |
| `status/success/` | default, hover, active, subtle, border, text | Success states |
| `status/warning/` | default, hover, active, subtle, border, text | Warning states |
| `status/info/` | default, subtle | Info states |
| `overlay/` | state layer, default black, default white, hover, pressed | Overlay colors |
| `shadow/` | color 1-4, inner/color 1-3 | Shadow colors (branded tint) |

---

## Typography

### Font
- **Inter** — all weights available (Thin to Black)
- Headings: Black (H1-H2), Bold (H3-H6)
- Body: Light (300), Bold (700)

### Text Styles (15 total)

| Style | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| Heading/H1 | 72px | Black | 110% | -1.5% |
| Heading/H2 | 60px | Black | 110% | -1.5% |
| Heading/H3 | 48px | Bold | 110% | -1.5% |
| Heading/H4 | 30px | Bold | 120% | -0.5% |
| Heading/H5 | 24px | Bold | 120% | -0.5% |
| Heading/H6 | 20px | Bold | 130% | -0.5% |
| Body/LG/300 | 18px | Light | 150% | 0% |
| Body/LG/700 | 18px | Bold | 150% | 0% |
| Body/MD/300 | 16px | Light | 140% | 0% |
| Body/MD/700 | 16px | Bold | 140% | 0% |
| Body/SM/300 | 14px | Light | 130% | 0% |
| Body/SM/700 | 14px | Bold | 130% | 0% |
| Caption/300 | 12px | Light | 130% | +0.5% |
| Caption/700 | 12px | Bold | 130% | +0.5% |
| Caption/XS | 10px | Light | 120% | +0.5% |

---

## Effect Styles

### Drop Shadows (Down)
| Style | Layers | Usage |
|---|---|---|
| effect/shadow/Shadow down/sm | 1 | Cards, subtle elevation |
| effect/shadow/Shadow down/md | 2 | Modals, dropdowns |
| effect/shadow/Shadow down/lg | 3 | Popovers, elevated cards |
| effect/shadow/Shadow down/XL | 4 | Dialogs, maximum elevation |

### Drop Shadows (Up)
Same 4 levels but with negative Y offset. Used for bottom sheets, bottom navigation.

### Inner Shadows
| Style | Layers | Usage |
|---|---|---|
| effect/shadow/inner/sm | 1 | Subtle inset (inputs, pressed) |
| effect/shadow/inner/md | 2 | Medium depth |
| effect/shadow/inner/lg | 3 | Deep inset |

### Glass Effects
- effect/glass/base
- effect/glass/strong
- effect/glass/elevated

### Blur
- effect/blur/xs, sm, md

---

## Component Library

### Atoms
| Component | Variants/Properties | Key Tokens |
|---|---|---|
| **Standard Button** | 3 variants (Primary, Secondary, Ghost) × 4 tones (Default, Danger, Success, Warning) × 4 sizes (S, M, L, XL) + States + Disabled | Padding, Gap, Radius, Height, Icon Size, Border Weight |
| **Icon Only Button** | Same variants × sizes + States | Same pattern, square proportions |
| **Link Button** | States + Disabled | Gap, Icon Size, Padding |
| **Split Button** | 4 sizes × variants | Divider Height + button tokens |
| **FAB** | S, M, XL + Menu items | Size, Icon Size, Radius (full) |
| **Pay Button** | Apple Pay, Google Pay styles | Min Width, Min Height |
| **Avatar** | 5 sizes (Xs, S, M, L, XL) + status dot | Size, Radius (full), Border Weight, Status Dot Size |
| **Badge** | 3 sizes (S, M, L) × tones | Padding X/Y, Radius, Border Weight |
| **Tag** | 2 sizes (S, M) × 3 variants (Primary, Outline, Ghost) × 4 tones + Selected state | Padding X/Y, Gap, Radius, Icon Size, Min Height, Border Weight |
| **Progress Bar** | 3 sizes (S, M, L) | Height, Radius, Border Weight |
| **Divider** | Default | Border Weight |
| **Tooltip** | Default | Padding, Radius, Arrow Radius |
| **Knob** | Default | Size, Padding, Radius, Border Weight |
| **ScrollBar** | Default | Padding, Radius |
| **Spinner** | 4 sizes (S, M, L, XL) | Size |
| **Selection Controls** | Checkbox, Radio Button, Switch × sizes × states | Size, Radius, Border Weight, Gap |
| **Segmented Control** | Main + Item | Radius, Padding, Gap, Border Weight |
| **Thumbnail** | Sizes + shapes (Rounded, Square, Circle) | Size, Radius, Border Weight |
| **Time Picker** | Default | Gap, Padding, Radius, Border Weight |
| **List Item** | Default | Padding X/Y, Gap, Icon Size |

### Content Blocks (Atoms)
| Component | Purpose |
|---|---|
| **Heading Block** | Draggable heading text for slots |
| **Text Block** | Draggable body text for slots |
| **Image Placeholder** | Generic image/media placeholder |

### Molecules
| Component | Key Features |
|---|---|
| **Search Bar** | 3 sizes (S, M, L), Radius full, Min Width |
| **Input** | Base Input, BottomLine, Select, Multiselect, Stepper, Textarea — each in 3 sizes |
| **Item List** | Gap, Radius, Border Weight, Min Width, Divider |
| **Tabs** | Padding, Radius, Underline Border Weight |
| **Pagination** | Min Width, Button Padding, Gap, Radius, Icon Size |
| **Entity Item** | Avatar + text, Gap, Label Gap, Avatar Radius/Border |
| **Entity Card** | Padding, Radius, General Gap + states (Default, Hover, Pressed, Active, Focused) |
| **Dropdown** | Gap, Item List integration |
| **Date Picker** | Calendar + Header + Footer, Container Radius, Day Item tokens |
| **Form Group** | 3 sizes, Padding, Gap, Radius, Border Weight, Items Gap |
| **Toast/Snackbar** | Padding, Gap, Icon Size, Radius, Border Weight |
| **Dialogs** | Padding, Text Gap, Radius |
| **Avatar Group** | Gap, Avatars Radius, Border Weight, Counter Size |
| **Range** | Tooltip Knob Gap |
| **Pin** | Size, Padding, Radius, Stroke Weight |

### Organisms
| Component | Key Features |
|---|---|
| **Top Bar** | Desktop + Mobile variants, Padding, Item Gap, Border Weight + Elevated variant |
| **Side Bar** | Expanded (280px) / Collapsed (64px), Gap, Border Weight |
| **Bottom Navigation** | Padding, Icon Size, Radius, Border Weight, shadow/up |
| **Stats Card** | Small (S/L) + Big (L/XL/Mobile), Padding, Gap, Radius, Border Weight |
| **Stacked List** | 9 variants: Default, Social, Ride Row, Delivery Row, Media Row, Product, Booking, Items Grid, Transport |
| **Share Item** | 2 types (Item, Avatar) × 4 tones (Default, Success, Warning, Danger) |

---

## Data Table System

### Components
| Component | Purpose | Key Properties |
|---|---|---|
| **_Internals / Header Label** | Column header text + sort icon | Label Gap, Sort Icon Size |
| **_Header Cell** | Column header container | Height (40px fix), Padding (16px), Border Weight, Min Width (93px) |
| **_Table Cell** | Body cell container | Height (56px fix), Padding (16px), Border Weight, Min Width (93px) |
| **_Header Row** | Row of header cells | Slot for cells, Row/Cell Gap |
| **_Table Row** | Body row with states | Default, Hover, Active states, bg on row, Slot for cells |
| **_Table Row Expanded** | Expandable row | Expanded/Collapsed × Default/Hover/Active, Row Slots for sub-rows |
| **_Table Footer** | Pagination footer | Desktop + Mobile variants, Padding, Radius (bottom) |
| **_Table (Header)** | Table header area | Desktop + Mobile, 5 Slots (Title, Actions, Middle, Navigation, Filter), 3 show/hide booleans |

### Global Tokens (shared between Header Cell and Table Cell)
| Token | Value | Purpose |
|---|---|---|
| Global/Padding | 16px | Cell horizontal padding (= header/footer padding for alignment) |
| Global/Padding Y | 16px | Header/footer vertical padding |
| Global/Border Weight | 1px (thin) | Cell bottom borders |
| Global/Min Width | 93px | Minimum column width |
| Global/Radius | 16px (xl) | Top corners on header, bottom on footer |

### Table Builder
- **Component Set** with `Device=Desktop` and `Device=Mobile` variants
- Desktop: Header + Header Row + Body Rows (SLOT) + Footer
- Mobile: Mobile Header + Scrollable Content (1000px in 370px frame) + Scrollbar + Mobile Footer
- Body Rows SLOT preferred values: _Table Row, _Table Row Expanded

### Table Prebuildere (5)
| Prebuilder | Columns | Special Features |
|---|---|---|
| **Invoice** | Invoice #, Customer, Amount, Status, Date | Expandable rows, avatars, status badges |
| **Users** | Name, Email, Role, Performance, Last Active | Avatar group, performance badges |
| **Tickets** | Ticket #, Subject, Priority, Team, Time | Avatar groups, priority flags, time tracker |
| **Products** | Product, Category, Price, Stock, Rating | Thumbnails, rating stars, stock badges |
| **Transactions** | ID, Description, Amount, Type, Date, Status | Expandable rows with fee breakdown |

---

## Card System

### _Card (Base)
- **3 elevations:** None, Low (shadow/sm), High (shadow/md)
- **Properties:** Show Header (bool), Show Footer (bool), Body Content (SLOT)
- **Tokens:** `--Organism/Card/Base/` — Padding (24px), Items Gap (24px), Header Gap (12px), Footer Gap (8px), Radius (8px/md)
- **Structure:** Header (title + close X) → Body Slot → Footer (Cancel + Action button)

### _Media Card
- **3 elevations:** None, Low, High
- **Properties:** Show Tag (bool), Show Date (bool), Media Slot, Content Slot
- **Tokens:** `--Organism/Card/Media/` — Padding (16px), Content Gap (12px), Footer Gap (8px), Image Height (240px), Min Width (280px), Radius (8px/md)
- **Structure:** Media Slot (image area) → Content Slot (tag, title, description, date, link button)
- **Link button aligned right**

---

## Bottom Sheet System

### _Bottom Sheet (Builder)
- **Width:** 375px (mobile)
- **Properties:** Show Handle (bool), Show Header (bool), Show Footer (bool), Body Content (SLOT), Footer Content (SLOT)
- **Tokens:** `--Organism/Bottom Sheet/` — Padding X/Y (16px), Radius (24px/2xl, top only), Content Gap, Handle (40×4px, full radius), Footer Padding Bottom (32px safe area)
- **Shadow:** effect/shadow/Shadow up/md
- **Body has NO padding** — sub-components provide their own

### Body Content Preferred Values (14)
Stacked List, Avatar, Input, Select Input, Multi-Select Input, Tag, Entity Item, Entity Card, Date Picker, Range, Knob, Heading Block, Text Block, Image Placeholder

### Footer Content Preferred Values (4)
Button, Button Link, Pay Buttons, Split Button

### Premade Bottom Sheets (18 variants)
| Category | Variants |
|---|---|
| **Share** | App Actions, Quick Contacts, Social List |
| **Transport** | Map (with transport options) |
| **Ride** | Driver Details, Delivery Track |
| **General** | Feedback, Settings, Sort |
| **Payment** | Method List, Add Card |
| **Media** | Playlist |
| **Auth** | Login |
| **Commerce** | Cart, Filter |
| **Info** | Terms & Conditions |
| **Booking** | Date Picker, Place List |

---

## Design Decisions

- **Cell padding controls alignment** — same padding (16px) on header, cells, and footer ensures everything aligns
- **Background on row, not cell** — enables full-row hover/active states
- **Height is fixed on cells** — prevents row height variation from different content types
- **Slots over Instance Swap** — used on Table Header, Bottom Sheet, Cards for maximum flexibility
- **Shadows are Effect Styles** (not variables) EXCEPT shadow/color/1-4 which are variables with light/dark mode
- **Entity Card/Item naming** — generic naming instead of "User Card/User Item"
- **Bottom Nav background** on container, not per item
- **Table Cell Height** is fixed per density; width is fixed per column
- **Data Table Row** has no own tokens — dimensions come from cells
- **Select Input State Layer** uses `Default-Black` overlay (to be refactored to bg-based hover in testing phase)

---

## Audit Items (Testing Phase)

- [ ] Font audit across all components (ensure Inter everywhere)
- [ ] Chevron vs Icon Button consistency on interactive components
- [ ] Focus states on all interactive components
- [ ] Hover/pressed/focus/disabled states completeness
- [ ] Select Input: refactor State Layer overlay to bg-based hover
- [ ] Token test mode: verify propagation by changing token values
- [ ] Component documentation pages (Material 3 style)
- [ ] Per-component property naming standardization
- [ ] Dark mode visual verification
- [ ] Accessibility contrast checks

---

## File Structure (Pages)

Key pages containing components:
- Buttons (Standard, IconOnly, Split, Link, FAB, Pay)
- Tag, Badge
- Avatar
- Inputs (Base, Select, Multiselect, Stepper, Textarea, BottomLine)
- Entity Item, Entity Card (User Card page)
- Stacked List
- Stats Card
- Data Table (Cells, Rows, Header, Footer, Pagination, Builder, Prebuildere)
- Bottom Sheet (Builder + Premade)
- Widget Card (Card + Media Card)
- Content Blocks (Heading Block, Text Block, Image Placeholder)
- Date Picker
- Icons (1000+ Lucide icons)

---

## Technical Notes

- Figma variables cannot bind line-height or letter-spacing as percentages (forced to pixels). These remain as direct values on text styles.
- Figma Plugin API cannot reliably traverse instance nodes deeper than 3-4 levels. Deeply nested text overrides require manual intervention.
- SLOT property type works by creating a frame with `componentPropertyReferences.slotContentId` linking to the SLOT property key. The frame automatically becomes type SLOT.
- Component properties added via `addComponentProperty` must be called on the COMPONENT_SET, not on individual variant components.
- `combineAsVariants` requires all components to be on the same page as the parent node.
