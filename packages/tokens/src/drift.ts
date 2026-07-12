#!/usr/bin/env node
/**
 * Token drift check (Phase 3 conformance gate).
 *
 *   pnpm -F @max-core/tokens drift
 *
 * Reads the `components` block from tokens.json and every mapped React
 * component's source, then asserts each component binds the spacing/size/radius
 * semantic vars its Figma tokens mandate. Unmapped families are skipped, so the
 * check grows incrementally as Phase 3 batches land. Exits non-zero on drift.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type ComponentSpec, checkComponent } from './conformance.js';
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
    prefixes: ['Atoms/Buttons/Global'], // Fab / Pay / Link / Split are separate components
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
    prefixes: ['Atoms/Buttons/Global'],
    exempt: [
      // Padding X and Gap are Standard Button tokens; the icon button is square
      // with a centered icon and no horizontal padding/gap.
      '--spacing-06',
      '--spacing-08',
      '--spacing-10',
      '--spacing-12',
      '--spacing-14',
      '--spacing-16',
    ],
  },
  {
    name: 'Link Button',
    source: 'components/LinkButton/LinkButton.tsx',
    prefixes: ['Atoms/Buttons/Link Button'],
  },
  {
    name: 'Pay Button',
    source: 'components/PayButton/PayButton.tsx',
    prefixes: ['Atoms/Buttons/Pay Button'],
  },
  {
    name: 'Split Button',
    source: 'components/SplitButton/SplitButton.tsx',
    prefixes: ['Atoms/Buttons/Split Button'],
  },
  {
    name: 'FAB',
    source: 'components/Fab/Fab.tsx',
    prefixes: ['Atoms/Buttons/Fab'],
  },
  // --- Batch 2: Display atoms ---
  {
    name: 'Divider',
    source: 'components/Divider/Divider.tsx',
    prefixes: ['Atoms/Divider'], // only a border-weight token — nothing dimensional to check
  },
  {
    name: 'Progress Bar',
    source: 'components/ProgressBar/ProgressBar.tsx',
    prefixes: ['Atoms/Progress Bar'],
  },
  {
    name: 'Tooltip',
    source: 'components/Tooltip/Tooltip.tsx',
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
    name: 'Content Blocks',
    source: 'components/ContentBlocks/ContentBlocks.tsx',
    prefixes: ['Atoms/Content Blocks'],
  },
  // --- Batch 3: Selection & interaction ---
  // Checkbox owns the shared Selection Control Global tokens (size boxes, text
  // gap, padding); Radio/Switch check only their dedicated prefixes.
  {
    name: 'Checkbox',
    source: 'components/Checkbox/Checkbox.tsx',
    prefixes: ['Atoms/Selection Control/Checkbox', 'Atoms/Selection Control/Global'],
    exempt: ['--spacing-08'], // Global/Item Gap — group-level (CheckboxGroup), not a single control
  },
  {
    name: 'Radio',
    source: 'components/Radio/Radio.tsx',
    prefixes: ['Atoms/Selection Control/Radio Button'],
    exempt: ['--radius-xs'], // Focus Radius — the ring follows the circular box, no rounded-xs square
  },
  {
    name: 'Switch',
    source: 'components/Switch/Switch.tsx',
    prefixes: ['Atoms/Selection Control/Switch'],
  },
  {
    name: 'Segmented Control',
    source: 'components/SegmentedControl/SegmentedControl.tsx',
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
  },
  {
    name: 'Bottom Line Input',
    source: 'components/BottomLineInput/BottomLineInput.tsx',
    prefixes: ['Molecule/Input/Bottom Line'],
  },
  {
    name: 'Stepper',
    source: 'components/Stepper/Stepper.tsx',
    prefixes: ['Molecule/Input/Stepper'],
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
  },
  {
    name: 'Search Bar',
    source: 'components/SearchBar/SearchBar.tsx',
    prefixes: ['Molecule/Search Bar'],
  },
  // --- Batch 5: Composition I ---
  {
    name: 'Item List',
    source: 'components/ItemList/ItemList.tsx',
    prefixes: ['Molecule/Item List'],
  },
  {
    name: 'Dropdown',
    source: 'components/Dropdown/Dropdown.tsx',
    prefixes: ['Molecule/Dropdown'],
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
];

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8')) as TokensFile;

let failed = 0;
console.log('Token drift check — spacing/size/radius conformance\n');
for (const spec of SPECS) {
  const source = readFileSync(resolve(reactSrc, spec.source), 'utf8');
  const r = checkComponent(tokens, spec, source);
  if (r.ok) {
    console.log(`  ✓ ${r.name}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${r.name} — missing ${r.missing.length} mandated var(s):`);
    for (const v of r.missing) console.log(`      ${v}`);
  }
  if (r.extra.length) {
    console.log(
      `      (binds ${r.extra.length} var(s) not in its Figma spec: ${r.extra.join(', ')})`,
    );
  }
}

if (failed) {
  console.log(`\n✗ ${failed} component(s) drifted from their Figma token spec.`);
  process.exit(1);
}
console.log('\n✓ All mapped components conform to their Figma token spec.');
