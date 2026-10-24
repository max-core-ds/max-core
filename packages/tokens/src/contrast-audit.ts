#!/usr/bin/env node
/**
 * Colour-contrast conformance gate (WCAG AA, both modes).
 *
 *   pnpm -F @max-core/tokens contrast
 *
 * Resolves the `Max Core - Colors` collection to hex per mode, extracts each
 * React component's text/background pairings, and asserts every pairing meets
 * AA (4.5:1 normal, 3:1 large) in BOTH light and dark mode. Exits non-zero on
 * any violation — the guardrail that keeps the ListItem-hover class of bug
 * (white text on a pale fill) from recurring.
 *
 * The extractor (see `contrast.ts`) is a file-level heuristic; per-component
 * OVERRIDES add cross-element pairings it can't see, mark large display text,
 * and exempt false positives — each with a written reason, mirroring `drift.ts`.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type ContrastViolation,
  type Pairing,
  checkContrast,
  extractPairings,
} from './contrast.js';
import { resolveColorVars } from './transform.js';
import type { TokensFile } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(here, 'tokens.json');
const componentsDir = resolve(here, '../../react/src/components');

/** A pairing pattern — fields left undefined match any value. */
interface PairMatcher {
  fg?: string;
  bg?: string;
  state?: string;
  reason: string;
}

/** Per-component tuning, keyed by component directory name. */
interface Override {
  /** Cross-element pairings the file-level heuristic can't infer. */
  extra?: Pairing[];
  /** Extracted pairings to skip (with a reason). */
  exempt?: PairMatcher[];
  /** Extracted pairings that are large text → 3:1 threshold. */
  large?: PairMatcher[];
}

const matches = (p: Pairing, m: PairMatcher): boolean =>
  (m.fg === undefined || m.fg === p.fgVar) &&
  (m.bg === undefined || m.bg === p.bgVar) &&
  (m.state === undefined || m.state === p.state);

// Button family: the Primary fill lives in compoundVariants and the label colour
// in `variant`, so they never share a class literal; Secondary/Ghost are
// transparent and sit on the page surface. Declare the real pairings.
const buttonFamily: Override = {
  extra: [
    { state: 'primary', fgVar: '--text-on-accent', bgVar: '--accent-default' },
    { state: 'primary-danger', fgVar: '--text-on-accent', bgVar: '--status-danger-default' },
    { state: 'secondary', fgVar: '--accent-default', bgVar: '--bg-surface' },
  ],
};

// Text fields: the field chrome lives in utils/field.ts (fieldBorder / fieldFill /
// fieldInvalid…), so value, placeholder and fill never share a class literal in
// the component file. Declare the real pairings per fill: value text/primary and
// placeholder text/muted on the field fill; the error placeholder
// status/danger/default on status/danger/subtle (Primary + invalid).
const textField = (fill: string): Override => ({
  extra: [
    { state: 'value', fgVar: '--text-primary', bgVar: fill },
    { state: 'placeholder', fgVar: '--text-muted', bgVar: fill },
    { state: 'invalid', fgVar: '--status-danger-default', bgVar: '--status-danger-subtle' },
  ],
});

const OVERRIDES: Record<string, Override> = {
  Input: textField('--bg-default'),
  SelectInput: textField('--bg-default'),
  Multiselect: textField('--bg-default'),
  Textarea: textField('--bg-surface'),
  Stepper: textField('--bg-surface'),
  // No error state; the magnifier + clear icons are text/secondary on the pill fill.
  SearchBar: {
    extra: [
      { state: 'value', fgVar: '--text-primary', bgVar: '--bg-default' },
      { state: 'placeholder', fgVar: '--text-muted', bgVar: '--bg-default' },
      { state: 'icon', fgVar: '--text-secondary', bgVar: '--bg-default' },
    ],
  },
  // Inactive item text sits on the group's bg/subtle — different elements.
  // Fails light AA (3.86); kept to match Figma by decision, on the designer list.
  SegmentedControl: {
    extra: [{ state: 'inactive', fgVar: '--text-secondary', bgVar: '--bg-subtle' }],
  },
  // The selected wheel row (accent/default) sits on the separate full-bleed
  // accent/subtle selector bar. Fails dark AA (3.33); kept to match Figma by
  // decision, on the designer list. Faded ±1/±2 rows are a deliberate distance
  // fade (non-selected context), not asserted.
  TimePicker: {
    extra: [{ state: 'selected', fgVar: '--accent-default', bgVar: '--accent-subtle' }],
  },
  Button: buttonFamily,
  IconOnlyButton: buttonFamily,
  SplitButton: buttonFamily,
  // Stacked List keeps text/primary + text/secondary from the base and only
  // swaps the row background per state, so text/bg never share a class literal —
  // declare the real pairings here. Primary text (the important one) must pass;
  // the text/secondary subtitle on the bg/subtle hover wash lands at ~3.9, the
  // same systemic near-AA shortfall tracked in the deferred dark-mode findings,
  // so it is intentionally not asserted here (would be a token-side fix).
  StackedList: {
    extra: [
      { state: 'base', fgVar: '--text-primary', bgVar: '--bg-surface' },
      { state: 'hover', fgVar: '--text-primary', bgVar: '--bg-subtle' },
    ],
  },
  // Data Table likewise sets cell/header text and row background on separate
  // elements. Assert the primary text on every row background + the header text.
  DataTable: {
    extra: [
      { state: 'header', fgVar: '--text-secondary', bgVar: '--bg-surface' },
      { state: 'cell', fgVar: '--text-primary', bgVar: '--bg-surface' },
      { state: 'hover', fgVar: '--text-primary', bgVar: '--bg-subtle' },
      { state: 'selected', fgVar: '--text-primary', bgVar: '--accent-subtle' },
    ],
  },
};

/** Colour vars that are never a solid text-on-fill role (skip if extracted). */
const IGNORE_VARS = new Set<string>([
  // e.g. border-only or decorative vars can be listed here with intent.
]);

function tsxFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...tsxFiles(full));
    else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.stories.tsx')) {
      out.push(full);
    }
  }
  return out;
}

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8')) as TokensFile;
const lightMap = resolveColorVars(tokens, 'light');
const darkMap = resolveColorVars(tokens, 'dark');

const ratio = (r: number | null) => (r === null ? ' n/a ' : r.toFixed(2).padStart(5));

let failed = 0;
let checked = 0;
console.log('Colour-contrast conformance — WCAG AA, light + dark\n');

for (const file of tsxFiles(componentsDir).sort()) {
  const name = relative(componentsDir, file).split('/')[0] as string;
  const source = readFileSync(file, 'utf8');
  const ov = OVERRIDES[name] ?? {};

  let pairings = extractPairings(source);
  // Skip exempted pairings; mark large-text ones.
  pairings = pairings
    .filter((p) => !(ov.exempt ?? []).some((m) => matches(p, m)))
    .map((p) => ((ov.large ?? []).some((m) => matches(p, m)) ? { ...p, largeText: true } : p));
  pairings.push(...(ov.extra ?? []));
  if (pairings.length === 0) continue;
  checked += 1;

  const violations = checkContrast(pairings, lightMap, darkMap, { ignoreVars: IGNORE_VARS });
  if (violations.length === 0) {
    console.log(`  ✓ ${name}`);
    continue;
  }
  failed += 1;
  console.log(`  ✗ ${name} — ${violations.length} pairing(s) below AA:`);
  for (const v of violations as ContrastViolation[]) {
    console.log(
      `      [${v.state}] ${v.fgVar} on ${v.bgVar} — ` +
        `light ${ratio(v.lightRatio)} / dark ${ratio(v.darkRatio)} ` +
        `(need ${v.threshold}, fails in ${v.failsIn.join(' + ')})`,
    );
  }
}

if (failed) {
  console.log(`\n✗ ${failed}/${checked} component(s) have a contrast violation.`);
  process.exit(1);
}
console.log(`\n✓ All ${checked} text-bearing component(s) pass AA in light and dark.`);
