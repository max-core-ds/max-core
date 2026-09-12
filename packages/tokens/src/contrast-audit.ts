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

const OVERRIDES: Record<string, Override> = {
  // Filled in as the audit surfaces real cases. Every entry carries a reason.
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
