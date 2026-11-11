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
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Avatar'],
  },
  {
    name: 'Tag',
    source: 'components/Tag/Tag.tsx',
    mode: 'component', // Phase 4.7
    // Its per-size tokens (they alias Global/*).
    prefixes: ['Atoms/Tag/S', 'Atoms/Tag/M'],
  },
  {
    name: 'Badge',
    source: 'components/Badge/Badge.tsx',
    mode: 'component', // Phase 4.7
    // Its per-size tokens (they alias Global/*).
    prefixes: ['Atoms/Badge/S', 'Atoms/Badge/M', 'Atoms/Badge/L'],
  },
  {
    name: 'Input (Base)',
    source: 'components/Input/Input.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Input/Base Input'],
  },
  // --- Batch 1: Button family ---
  {
    name: 'Spinner',
    source: 'components/Spinner/Spinner.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Spinner'],
    exempt: [
      // Bound to strokes with no paint in Figma — they never render. The ring
      // follows the master's rendered donut geometry instead (flagged to Max).
      '--spinner-track-stroke',
      '--spinner-indicator-stroke',
    ],
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
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Divider'],
  },
  {
    name: 'Progress Bar',
    // Track heights + radius live in the shared util (also used by Range).
    source: ['components/ProgressBar/ProgressBar.tsx', 'utils/progress.ts'],
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Progress Bar'],
    exempt: [
      '--progress-bar-global-border-weight', // none: the track has no visible stroke
      '--progress-bar-global-radius', // reached through Size */Radius
    ],
  },
  {
    name: 'Tooltip',
    // Padding/radius/arrow-radius live in the shared bubble util (also used by Range).
    source: ['components/Tooltip/Tooltip.tsx', 'utils/tooltip-surface.ts'],
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Tooltip'],
  },
  {
    name: 'Knob',
    source: 'components/Knob/Knob.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Knob'],
  },
  {
    name: 'Thumbnail',
    source: 'components/Thumbnail/Thumbnail.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Thumbnail'],
  },
  {
    name: 'ScrollBar',
    source: 'components/ScrollBar/ScrollBar.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Scroll Bar'],
  },
  {
    name: 'Time Picker',
    source: 'components/TimePicker/TimePicker.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Time Picker'],
    exempt: [
      // Period column centers AM/PM with spacer rows instead of a bottom padding.
      '--time-picker-period-bottom-padding',
    ],
  },
  {
    name: 'Status Dot',
    source: 'components/StatusDot/StatusDot.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/Status Dot'], // within-avatar sizes live under Atoms/Avatar
  },
  {
    name: 'Content Blocks',
    source: 'components/ContentBlocks/ContentBlocks.tsx',
    mode: 'component', // Phase 4.7
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
    mode: 'component', // Phase 4.7
    prefixes: ['Atoms/List Item'],
  },
  // --- Batch 4: Input molecules ---
  {
    name: 'Textarea',
    source: 'components/Textarea/Textarea.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Input/Textarea'],
  },
  {
    name: 'Bottom Line Input',
    source: 'components/BottomLineInput/BottomLineInput.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Input/Bottom Line'],
  },
  {
    name: 'Stepper',
    source: 'components/Stepper/Stepper.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Input/Stepper'],
  },
  {
    name: 'Select Input',
    source: 'components/SelectInput/SelectInput.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Input/Select Input'],
  },
  {
    name: 'Multiselect',
    source: 'components/Multiselect/Multiselect.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Input/Multiselect'],
    exempt: [
      // Badge/Min Width = 240 is the field's Min Width (bound per Size), not a chip size.
      '--input-multiselect-badge-min-width',
    ],
  },
  {
    name: 'Search Bar',
    source: 'components/SearchBar/SearchBar.tsx',
    mode: 'component', // Phase 4.7
    // Global/Gap is reached through Size */Gap.
    prefixes: ['Molecule/Search Bar'],
    exempt: ['--search-bar-global-gap'],
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
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Item List'],
    exempt: [
      // Label Helper Gap is bound inside the List Item rows (label ↔ support text) — ListItem.tsx.
      '--item-list-label-helper-gap',
      // Divider Stroke is the composed Divider's own weight.
      '--item-list-divider-stroke',
    ],
  },
  {
    name: 'Dropdown',
    source: 'components/Dropdown/Dropdown.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Dropdown'],
    exempt: [
      // Gap (trigger ↔ list) is the positioner's numeric sideOffset (px).
      '--dropdown-gap',
      // Item List Padding is left-only in the master — the list matches the trigger width.
      '--dropdown-item-list-padding',
    ],
  },
  {
    name: 'Tabs',
    source: 'components/Tabs/Tabs.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Tabs'],
  },
  {
    name: 'Pagination',
    source: 'components/Pagination/Pagination.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Pagination'],
  },
  {
    name: 'Avatar Group',
    source: 'components/AvatarGroup/AvatarGroup.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Avatar Group'],
  },
  {
    name: 'Range',
    source: 'components/Range/Range.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Range'],
  },
  {
    name: 'Pin',
    source: 'components/Pin/Pin.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Pin'],
  },
  {
    name: 'Switcher',
    source: 'components/Switcher/Switcher.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Switcher'],
  },
  // --- Batch 6: Entity & overlay ---
  {
    name: 'Entity Item',
    source: 'components/EntityItem/EntityItem.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Entity Item'],
    // Avatar radius / border are applied by the composed Avatar (leading slot).
    exempt: ['--entity-item-avatar-radius', '--entity-item-avatar-border'],
  },
  {
    name: 'Entity Card',
    source: 'components/EntityCard/EntityCard.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Entity Card'],
  },
  {
    name: 'Form Group',
    source: 'components/FormGroup/FormGroup.tsx',
    mode: 'component', // Phase 4.7
    // The per-type premade tokens (Log in, Sign up, …) alias Premade/Global.
    prefixes: [
      'Molecule/Form Group/Global',
      'Molecule/Form Group/Size',
      'Molecule/Form Group/Premade/Global',
    ],
    exempt: [
      // Content Width is the premade recipes' column width — a story/recipe concern.
      '--form-group-premade-global-size-s-content-width',
      '--form-group-premade-global-size-m-content-width',
      '--form-group-premade-global-size-l-content-width',
    ],
  },
  {
    name: 'Toast',
    source: 'components/Toast/Toast.tsx',
    mode: 'component', // Phase 4.7
    prefixes: ['Molecule/Toast Snackbar'],
  },
  {
    name: 'Dialog',
    source: 'components/Dialog/Dialog.tsx',
    mode: 'component', // Phase 4.7
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
