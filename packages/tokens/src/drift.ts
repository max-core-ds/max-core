#!/usr/bin/env node
/**
 * Token drift check (Phase 3 conformance gate).
 *
 *   pnpm -F @max-core/tokens drift
 *
 * Two checks, exit non-zero on either:
 *
 * 1. Unknown vars — every `var(--…)` / `p-(--…)` in packages/react/src must be
 *    defined by the generated tokens.css / theme.css, scrollbar.css, the source
 *    itself (`[--x:…]`), or a library (Base UI, Tailwind). Catches typos and
 *    tokens renamed or deleted in Figma after a re-export.
 * 2. Conformance — per mapped component, against the `components` block:
 *    `semantic` mode (not yet migrated) binds the spacing/size/radius semantic
 *    vars its Figma tokens resolve to; `component` mode (Phase 4.7 migrated)
 *    binds its own component vars. Unmapped families are skipped.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type ComponentSpec,
  LIBRARY_VAR_PREFIXES,
  checkComponent,
  definedVarsIn,
  localVarsIn,
  usedVarsIn,
} from './conformance.js';
import { generateThemeCss, generateTokensCss } from './transform.js';
import type { TokensFile } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(here, 'tokens.json');
const reactSrc = resolve(here, '../../react/src');

/**
 * Family → component map. `prefixes` are `components` keys (leading `-- `
 * stripped) the component owns; `exempt` lists mandated vars it legitimately
 * does not bind, each with a reason. Only built components appear here — the
 * rest of the 414-token families are skipped until their batch lands.
 */
const SPECS: ComponentSpec[] = [
  {
    name: 'Button (Standard)',
    source: 'components/Button/Button.tsx',
    mode: 'component', // Phase 4.7
    // Its own level-4 tokens (they alias Global/Size *) + the shared Global ones.
    prefixes: [
      'Atoms/Buttons/Standard Button',
      'Atoms/Buttons/Global/Primary Border Width',
      'Atoms/Buttons/Global/Secondary Border Width',
      'Atoms/Buttons/Global/Standard Min Width',
    ],
  },
  {
    name: 'Avatar',
    source: 'components/Avatar/Avatar.tsx',
    prefixes: ['Atoms/Avatar'],
    exempt: [
      '--size-8', // status dot (XS/S) — status dot not implemented yet
      '--size-20', // status dot (XL) — status dot not implemented yet
      '--size-16', // status dot (M/L) — status dot not implemented yet
    ],
  },
  {
    name: 'Tag',
    source: 'components/Tag/Tag.tsx',
    prefixes: ['Atoms/Tag'],
  },
  {
    name: 'Badge',
    source: 'components/Badge/Badge.tsx',
    prefixes: ['Atoms/Badge'],
  },
  {
    name: 'Input (Base)',
    source: 'components/Input/Input.tsx',
    prefixes: [
      'Molecule/Input/Global/General',
      'Molecule/Input/Global/Size',
      'Molecule/Input/Base Input',
    ],
    exempt: [
      '--size-16', // icon size S — base Input has no icon slot
      '--size-20', // icon size M — base Input has no icon slot
      '--size-24', // icon size L — base Input has no icon slot
      '--spacing-08', // General Inner/Items Gap — base field has no internal items
    ],
  },
  // --- Batch 1: Button family ---
  {
    name: 'Spinner',
    source: 'components/Spinner/Spinner.tsx',
    prefixes: ['Atoms/Spinner'],
  },
  {
    name: 'Icon Only Button',
    source: 'components/IconOnlyButton/IconOnlyButton.tsx',
    mode: 'component', // Phase 4.7
    prefixes: [
      'Atoms/Buttons/Icon Only',
      'Atoms/Buttons/Global/Primary Border Width',
      'Atoms/Buttons/Global/Secondary Border Width',
    ],
  },
  {
    name: 'Link Button',
    source: 'components/LinkButton/LinkButton.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Buttons/Link Button'],
  },
  {
    name: 'Split Button',
    source: 'components/SplitButton/SplitButton.tsx',
    mode: 'component', // Phase 4.7
    prefixes: [
      'Atoms/Buttons/Split Button',
      'Atoms/Buttons/Global/Primary Border Width',
      'Atoms/Buttons/Global/Secondary Border Width',
    ],
  },
  {
    name: 'FAB',
    source: 'components/Fab/Fab.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Buttons/Fab'],
    exempt: [
      '--buttons-fab-border-width', // none, and the master has no stroke to size
      '--buttons-fab-global-radius', // reached through Main/<size>/Radius + Menu/Item Radius
    ],
  },
  // --- Batch 2: Display atoms ---
  {
    name: 'Divider',
    source: 'components/Divider/Divider.tsx',
    prefixes: ['Atoms/Divider'], // only a border-weight token — nothing dimensional to check
  },
  {
    name: 'Progress Bar',
    // Track heights + radius live in the shared util (also used by Range).
    source: ['components/ProgressBar/ProgressBar.tsx', 'utils/progress.ts'],
    prefixes: ['Atoms/Progress Bar'],
  },
  {
    name: 'Tooltip',
    // Padding/radius/arrow-radius live in the shared bubble util (also used by Range).
    source: ['components/Tooltip/Tooltip.tsx', 'utils/tooltip-surface.ts'],
    prefixes: ['Atoms/Tooltip'],
  },
  {
    name: 'Knob',
    source: 'components/Knob/Knob.tsx',
    prefixes: ['Atoms/Knob'],
  },
  {
    name: 'Thumbnail',
    source: 'components/Thumbnail/Thumbnail.tsx',
    prefixes: ['Atoms/Thumbnail'],
  },
  {
    name: 'ScrollBar',
    source: 'components/ScrollBar/ScrollBar.tsx',
    prefixes: ['Atoms/Scroll Bar'],
  },
  {
    name: 'Time Picker',
    source: 'components/TimePicker/TimePicker.tsx',
    prefixes: ['Atoms/Time Picker'],
    exempt: [
      // Period column centers AM/PM with spacer rows instead of a bottom padding.
      '--spacing-28',
    ],
  },
  {
    name: 'Status Dot',
    source: 'components/StatusDot/StatusDot.tsx',
    prefixes: ['Atoms/Status Dot'], // within-avatar sizes live under Atoms/Avatar
  },
  {
    name: 'Content Blocks',
    source: 'components/ContentBlocks/ContentBlocks.tsx',
    prefixes: ['Atoms/Content Blocks'],
  },
  // --- Batch 3: Selection & interaction ---
  // Each control binds its own tokens plus the Global box sizes / wrapper padding.
  {
    name: 'Checkbox',
    source: 'components/Checkbox/Checkbox.tsx',
    mode: 'component', // Phase 4.7
    // Its own tokens + the Global sizes / padding it uses directly (Global
    // Text Gap / Item Gap / Border Weight are reached through its own aliases).
    prefixes: [
      'Atoms/Selection Control/Checkbox',
      'Atoms/Selection Control/Global/Size',
      'Atoms/Selection Control/Global/Padding',
    ],
  },
  {
    name: 'Radio',
    source: 'components/Radio/Radio.tsx',
    mode: 'component', // Phase 4.7
    prefixes: [
      'Atoms/Selection Control/Radio Button',
      'Atoms/Selection Control/Global/Size',
      'Atoms/Selection Control/Global/Padding',
    ],
    // Focus Radius — the ring follows the circular box, no rounded-xs square
    exempt: ['--selection-control-radio-button-focus-radius'],
  },
  {
    name: 'Switch',
    source: 'components/Switch/Switch.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Selection Control/Switch', 'Atoms/Selection Control/Global/Padding'],
  },
  {
    name: 'Segmented Control',
    source: 'components/SegmentedControl/SegmentedControl.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Segmented Control'],
  },
  {
    name: 'List Item',
    source: 'components/ListItem/ListItem.tsx',
    prefixes: ['Atoms/List Item'],
  },
  // --- Batch 4: Input molecules ---
  // Textarea/Select/Multiselect own only raw-number tokens (min width/height),
  // so their checked spec is empty; radius/padding come from the Input Global
  // tokens (checked via the base Input).
  {
    name: 'Textarea',
    source: 'components/Textarea/Textarea.tsx',
    prefixes: ['Molecule/Input/Textarea'],
    exempt: ['--spacing-08'], // Inner Gap is an icon-to-text gap — textarea has no icon slot
  },
  {
    name: 'Bottom Line Input',
    source: 'components/BottomLineInput/BottomLineInput.tsx',
    prefixes: ['Molecule/Input/Bottom Line'],
    exempt: [
      '--size-16', // icon size S — underline input renders no icons
      '--size-20', // icon size M — underline input renders no icons
      '--size-24', // icon size L — underline input renders no icons
      '--spacing-08', // Inner Gap — no icon slot, so no internal items to space
    ],
  },
  {
    name: 'Stepper',
    source: 'components/Stepper/Stepper.tsx',
    prefixes: ['Molecule/Input/Stepper'],
    exempt: [
      '--size-16', // icon size S — ± are typographic glyphs, not sized icons
      '--size-20', // icon size M — ± are typographic glyphs, not sized icons
      '--size-24', // icon size L — ± are typographic glyphs, not sized icons
    ],
  },
  {
    name: 'Select Input',
    source: 'components/SelectInput/SelectInput.tsx',
    prefixes: ['Molecule/Input/Select Input'],
  },
  {
    name: 'Multiselect',
    source: 'components/Multiselect/Multiselect.tsx',
    prefixes: ['Molecule/Input/Multiselect'],
    exempt: [
      '--size-24', // Icon Size L — single-size combobox; no L-size 24px icon
      '--spacing-16', // Size L Padding Y — single-size component uses the M padding
    ],
  },
  {
    name: 'Search Bar',
    source: 'components/SearchBar/SearchBar.tsx',
    prefixes: ['Molecule/Search Bar'],
  },
  {
    name: 'Action Bar',
    source: 'components/ActionBar/ActionBar.tsx',
    prefixes: ['Molecule/Action Bar'],
  },
  // --- Batch 5: Composition I ---
  {
    name: 'Item List',
    source: 'components/ItemList/ItemList.tsx',
    prefixes: ['Molecule/Item List'],
    exempt: [
      '--spacing-04', // Label Helper Gap — bound inside the List Item rows (label ↔ support text), lives in ListItem.tsx
    ],
  },
  {
    name: 'Dropdown',
    source: 'components/Dropdown/Dropdown.tsx',
    prefixes: ['Molecule/Dropdown'],
    exempt: [
      // Gap (trigger ↔ list) is the positioner's numeric sideOffset; Item List
      // Padding (left-only in the master) isn't applied — the list matches the trigger width.
      '--spacing-04',
    ],
  },
  {
    name: 'Tabs',
    source: 'components/Tabs/Tabs.tsx',
    prefixes: ['Molecule/Tabs'],
  },
  {
    name: 'Pagination',
    source: 'components/Pagination/Pagination.tsx',
    prefixes: ['Molecule/Pagination'],
  },
  {
    name: 'Avatar Group',
    source: 'components/AvatarGroup/AvatarGroup.tsx',
    prefixes: ['Molecule/Avatar Group'], // Gap is a raw negative overlap — nothing dimensional to check
    exempt: ['--size-24'], // avatar/counter dimensions come from the composed Avatar (see Avatar spec)
  },
  {
    name: 'Range',
    source: 'components/Range/Range.tsx',
    prefixes: ['Molecule/Range'],
  },
  {
    name: 'Pin',
    source: 'components/Pin/Pin.tsx',
    prefixes: ['Molecule/Pin'],
  },
  {
    name: 'Switcher',
    source: 'components/Switcher/Switcher.tsx',
    prefixes: ['Molecule/Switcher'],
  },
  // --- Batch 6: Entity & overlay ---
  {
    name: 'Entity Item',
    source: 'components/EntityItem/EntityItem.tsx',
    prefixes: ['Molecule/Entity Item'],
    exempt: ['--radius-full'], // avatar radius is applied by the composed Avatar (leading slot)
  },
  {
    name: 'Entity Card',
    source: 'components/EntityCard/EntityCard.tsx',
    prefixes: ['Molecule/Entity Card'],
  },
  {
    name: 'Form Group',
    source: 'components/FormGroup/FormGroup.tsx',
    prefixes: ['Molecule/Form Group'],
  },
  {
    name: 'Toast',
    source: 'components/Toast/Toast.tsx',
    prefixes: ['Molecule/Toast Snackbar'],
  },
  {
    name: 'Dialog',
    source: 'components/Dialog/Dialog.tsx',
    prefixes: ['Molecule/Dialogs'],
  },
  // --- Batch 7: Organisms (Share Item has no tokens; Stacked List → Batch 8) ---
  {
    name: 'Top Bar',
    source: 'components/TopBar/TopBar.tsx',
    prefixes: ['Organism/Top Bar'], // Background opacity is a {primitives.opacity} ref — auto-excluded
  },
  {
    name: 'Side Bar',
    source: 'components/SideBar/SideBar.tsx',
    prefixes: ['Organism/Side Bar'],
  },
  {
    name: 'Bottom Navigation',
    source: 'components/BottomNavigation/BottomNavigation.tsx',
    prefixes: ['Organism/Bottom Navigation Bar'],
  },
  {
    name: 'Stats Card',
    source: 'components/StatsCard/StatsCard.tsx',
    prefixes: ['Organism/Stats card'],
  },
  // --- Batch 8: mega-systems (lean v1) ---
  {
    name: 'Stacked List',
    source: 'components/StackedList/StackedList.tsx',
    // Only the row variants built in the lean v1; the rest (Ride/Delivery/
    // Booking/Item Grid/Transport) land when their variants do.
    prefixes: [
      'Organism/Stacked List/Global',
      'Organism/Stacked List/Default',
      'Organism/Stacked List/Social',
      'Organism/Stacked List/Media Row',
      'Organism/Stacked List/Product',
    ],
  },
  // --- Batch 10: Card system ---
  {
    name: 'Card',
    source: 'components/Card/Card.tsx',
    prefixes: ['Organism/Card/Base', 'Organism/Card/Media'],
  },
  // --- Batch 11: Bottom Sheet ---
  {
    name: 'Bottom Sheet',
    source: 'components/BottomSheet/BottomSheet.tsx',
    prefixes: ['Organism/Bottom Sheet'],
    exempt: [
      '--spacing-24', // General Gap — bound nowhere on the builder master
    ],
  },
  {
    name: 'Data Table',
    source: 'components/DataTable/DataTable.tsx',
    // Table Header (slot-heavy) and Table Builder (mobile) are out of the v1;
    // their prefixes are simply not listed. Cell-item content is caller-composed.
    prefixes: [
      'Organism/Data Table/Global',
      'Organism/Data Table/Header Cell',
      'Organism/Data Table/Table Cell',
      'Organism/Data Table/Table Row',
      'Organism/Data Table/Footer',
    ],
    exempt: [
      '--spacing-06', // Table Cell/Cell Item/Simple Text Gap — no Simple Text cell-item in v1; text cells render plain content
    ],
  },
  {
    name: 'Date Picker',
    source: 'components/DatePicker/DatePicker.tsx',
    // One class of tokens under one prefix; the day-grid is rendered by
    // react-day-picker but restyled entirely via our token-bound `classNames`.
    prefixes: ['Molecule/Date Picker'],
  },
];

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8')) as TokensFile;

// ---- 1. unknown vars ----
const defined = new Set([
  ...definedVarsIn(generateTokensCss(tokens)),
  ...definedVarsIn(generateThemeCss(tokens)),
  ...definedVarsIn(readFileSync(resolve(here, 'scrollbar.css'), 'utf8')),
]);
const sourceFiles: string[] = [];
const walk = (dir: string): void => {
  for (const f of readdirSync(dir)) {
    const p = resolve(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f) && !/\.(stories|test)\.tsx?$/.test(f)) sourceFiles.push(p);
  }
};
walk(reactSrc);
const sources = sourceFiles.map((f) => [f, readFileSync(f, 'utf8')] as const);
const local = new Set(sources.flatMap(([, s]) => [...localVarsIn(s)]));
const unknown: string[] = [];
for (const [file, src] of sources) {
  for (const v of usedVarsIn(src)) {
    if (defined.has(v) || local.has(v) || LIBRARY_VAR_PREFIXES.some((p) => v.startsWith(p)))
      continue;
    unknown.push(`${v}  (${file.slice(reactSrc.length + 1)})`);
  }
}
console.log('Token drift check\n\n1. Unknown CSS vars (not defined by tokens.css / theme.css)\n');
if (unknown.length) {
  for (const u of unknown.sort()) console.log(`  ✗ ${u}`);
} else {
  console.log(`  ✓ none — ${sourceFiles.length} files, ${defined.size} defined vars`);
}

// ---- 2. conformance ----
let failed = 0;
console.log('\n2. Conformance — semantic mode: spacing/size/radius · component mode: own vars\n');
for (const spec of SPECS) {
  const paths = Array.isArray(spec.source) ? spec.source : [spec.source];
  const source = paths.map((p) => readFileSync(resolve(reactSrc, p), 'utf8')).join('\n');
  const r = checkComponent(tokens, spec, source);
  const tag = spec.mode === 'component' ? ' [component vars]' : '';
  if (r.ok) {
    console.log(`  ✓ ${r.name}${tag}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${r.name}${tag} — missing ${r.missing.length} mandated var(s):`);
    for (const v of r.missing) console.log(`      ${v}`);
  }
  if (r.extra.length) {
    const what =
      spec.mode === 'component'
        ? 'raw semantic var(s) instead of its own tokens'
        : 'var(s) not in its Figma spec';
    console.log(`      (binds ${r.extra.length} ${what}: ${r.extra.join(', ')})`);
  }
}

if (unknown.length) console.log(`\n✗ ${unknown.length} unknown CSS var reference(s).`);
if (failed) console.log(`\n✗ ${failed} component(s) drifted from their Figma token spec.`);
if (unknown.length || failed) process.exit(1);
console.log('\n✓ No unknown vars; all mapped components conform to their Figma token spec.');
