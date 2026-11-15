#!/usr/bin/env node
/**
 * Sync CLI: ingest a tokens.json produced by @max-core-ds/figma-plugin into the
 * repo. Validates shape, prints a diff vs the current source file, writes
 * unless --dry-run.
 *
 *   pnpm -F @max-core-ds/tokens sync               # reads ~/Downloads/tokens.json
 *   pnpm -F @max-core-ds/tokens sync --input X     # explicit path
 *   pnpm -F @max-core-ds/tokens sync --dry-run     # preview without writing
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { diffTokens, formatDiffText } from './diff.js';
import type { TokensFile } from './types.js';

// ---- arg parsing ----
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const inputIdx = args.indexOf('--input');
const customInput = inputIdx >= 0 ? args[inputIdx + 1] : undefined;
const inputPath = customInput
  ? resolve(process.cwd(), customInput)
  : resolve(homedir(), 'Downloads', 'tokens.json');

const here = dirname(fileURLToPath(import.meta.url));
const targetPath = resolve(here, 'tokens.json');

// ---- read incoming ----
if (!existsSync(inputPath)) {
  console.error(`✗ Input not found: ${inputPath}`);
  console.error('  Run the Figma plugin first, or pass --input <path>.');
  process.exit(1);
}

let incoming: TokensFile;
try {
  incoming = JSON.parse(readFileSync(inputPath, 'utf8'));
} catch (err) {
  console.error(`✗ Input is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

// ---- validate shape ----
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validateShape(t: unknown): asserts t is TokensFile {
  if (!isObject(t)) throw new Error('root is not an object');
  if (!isObject(t.primitives)) throw new Error('missing or invalid `primitives`');
  if (!isObject(t.semantics)) throw new Error('missing or invalid `semantics`');
  for (const sub of ['spacing', 'size', 'radius', 'border-weight', 'opacity']) {
    if (!isObject((t.semantics as Record<string, unknown>)[sub])) {
      throw new Error(`missing semantics.${sub}`);
    }
  }
  if (!isObject(t.colors)) throw new Error('missing or invalid `colors`');
  const c = t.colors as Record<string, unknown>;
  if (!isObject(c.light) || !isObject(c.dark)) {
    throw new Error('colors must have both `light` and `dark` objects');
  }
}

try {
  validateShape(incoming);
} catch (err) {
  console.error(`✗ Invalid TokensFile shape: ${(err as Error).message}`);
  process.exit(1);
}

// ---- diff ----
const existing: TokensFile | null = existsSync(targetPath)
  ? (JSON.parse(readFileSync(targetPath, 'utf8')) as TokensFile)
  : null;
const diff = diffTokens(existing ?? {}, incoming);
const leafCount = (t: unknown): number => diffTokens({}, t).added.length;

// ---- report ----
console.log(`Source: ${inputPath}`);
console.log(`Target: ${targetPath}`);
console.log('');
console.log(
  `Incoming: ${leafCount(incoming)} tokens · ${Object.keys(incoming.colors.light).length} light · ${Object.keys(incoming.colors.dark).length} dark`,
);
console.log(
  `Existing: ${existing ? leafCount(existing) : 0} tokens${existing ? '' : ' (no current tokens.json)'}`,
);
console.log('');
console.log(formatDiffText(diff));

// ---- write ----
if (dryRun) {
  console.log('\n(dry-run — no changes written. Re-run without --dry-run to apply.)');
} else {
  writeFileSync(targetPath, `${JSON.stringify(incoming, null, 2)}\n`, 'utf8');
  console.log(`\n✓ Wrote ${targetPath}`);
  console.log('  Next: pnpm -F @max-core-ds/tokens build');
}
