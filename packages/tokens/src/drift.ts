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
