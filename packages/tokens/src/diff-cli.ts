#!/usr/bin/env node
/**
 * Token diff between two tokens.json files (CI PR comment, local review).
 *
 *   pnpm -F @max-core-ds/tokens diff --base <old tokens.json> [--head <new>] [--format md|text]
 *
 * --head defaults to this package's src/tokens.json. Writes the report to stdout.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { diffTokens, formatDiffMarkdown, formatDiffText } from './diff.js';

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const base = flag('--base');
if (!base) {
  console.error(
    'Usage: diff --base <old tokens.json> [--head <new tokens.json>] [--format md|text]',
  );
  process.exit(2);
}
const head = flag('--head') ?? resolve(dirname(fileURLToPath(import.meta.url)), 'tokens.json');
const read = (p: string): unknown => JSON.parse(readFileSync(resolve(process.cwd(), p), 'utf8'));

const diff = diffTokens(read(base), read(head));
console.log(flag('--format') === 'md' ? formatDiffMarkdown(diff) : formatDiffText(diff));
