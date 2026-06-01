#!/usr/bin/env node
/**
 * Sync CLI: ingest a tokens.json produced by @max-core/figma-plugin into the
 * repo. Validates shape, prints a diff vs the current source file, writes
 * unless --dry-run.
 *
 *   pnpm -F @max-core/tokens sync               # reads ~/Downloads/tokens.json
 *   pnpm -F @max-core/tokens sync --input X     # explicit path
 *   pnpm -F @max-core/tokens sync --dry-run     # preview without writing
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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

// ---- collect paths for diff ----
function collectPaths(node: unknown, prefix = ''): Set<string> {
  const out = new Set<string>();
  if (!isObject(node)) {
    if (prefix) out.add(prefix);
    return out;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue; // skip metadata
    const path = prefix ? `${prefix}.${k}` : k;
    if (isObject(v)) {
      for (const p of collectPaths(v, path)) out.add(p);
    } else {
      out.add(path);
    }
  }
  return out;
}

const existing: TokensFile | null = existsSync(targetPath)
  ? (JSON.parse(readFileSync(targetPath, 'utf8')) as TokensFile)
  : null;

const incomingPaths = collectPaths(incoming);
const existingPaths = existing ? collectPaths(existing) : new Set<string>();

const added = [...incomingPaths].filter((p) => !existingPaths.has(p));
const removed = [...existingPaths].filter((p) => !incomingPaths.has(p));

// Detect changes (path in both but different value)
function leafByPath(node: unknown, path: string): unknown {
  let cur: unknown = node;
  for (const seg of path.split('.')) {
    if (!isObject(cur)) return undefined;
    cur = cur[seg];
  }
  return cur;
}

const changed: string[] = [];
if (existing) {
  for (const p of incomingPaths) {
    if (!existingPaths.has(p)) continue;
    const before = leafByPath(existing, p);
    const after = leafByPath(incoming, p);
    if (before !== after) changed.push(p);
  }
}

// ---- report ----
console.log(`Source: ${inputPath}`);
console.log(`Target: ${targetPath}`);
console.log('');
console.log(
  `Incoming: ${incomingPaths.size} tokens · ${Object.keys((incoming.colors as { light: object }).light).length} light · ${Object.keys((incoming.colors as { dark: object }).dark).length} dark`,
);
console.log(
  `Existing: ${existingPaths.size} tokens` + (existing ? '' : ' (no current tokens.json)'),
);
console.log('');
console.log(`+ ${added.length} added   - ${removed.length} removed   ~ ${changed.length} changed`);

function sample(arr: string[], n: number): string[] {
  return arr.slice(0, n);
}

if (added.length) {
  console.log(`\nAdded (showing first 10):`);
  for (const p of sample(added, 10)) console.log(`  + ${p}`);
  if (added.length > 10) console.log(`  … and ${added.length - 10} more`);
}
if (removed.length) {
  console.log(`\nRemoved (showing first 10):`);
  for (const p of sample(removed, 10)) console.log(`  - ${p}`);
  if (removed.length > 10) console.log(`  … and ${removed.length - 10} more`);
}
if (changed.length) {
  console.log(`\nChanged (showing first 10):`);
  for (const p of sample(changed, 10)) {
    const before = leafByPath(existing!, p);
    const after = leafByPath(incoming, p);
    console.log(`  ~ ${p}: ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
  }
  if (changed.length > 10) console.log(`  … and ${changed.length - 10} more`);
}

// ---- write ----
if (dryRun) {
  console.log('\n(dry-run — no changes written. Re-run without --dry-run to apply.)');
} else {
  writeFileSync(targetPath, `${JSON.stringify(incoming, null, 2)}\n`, 'utf8');
  console.log(`\n✓ Wrote ${targetPath}`);
  console.log('  Next: pnpm -F @max-core/tokens build');
}
