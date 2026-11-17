#!/usr/bin/env node
// Guard for docs/a11y-exceptions.md (Phase 6.3): every switched-off or accepted
// accessibility check in the code is declared in the doc, and every doc row still
// has its marker in the code. Exit 1 on any mismatch.
//
// A marker is an a11y `test: 'todo' | 'off'`, an axe rule with `enabled: false`, or a
// Vitest `.fails` / `.skip`. It needs `A11Y-EXCEPTION: A11Y-NNN` on the same line or
// within the 3 lines above. `.only` is never allowed.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const docPath = join(root, 'docs/a11y-exceptions.md');
const scanDirs = ['apps/storybook/src', 'apps/storybook/.storybook', 'packages/react/src'];

const MARKERS = [
  { re: /\btest:\s*['"](todo|off)['"]/, what: "a11y test: 'todo' / 'off'" },
  { re: /\benabled:\s*false\b/, what: 'axe rule disabled' },
  { re: /\b(?:it|test|describe)\.(?:fails|skip)\s*\(/, what: 'Vitest .fails / .skip' },
];
const ONLY = /\b(?:it|test|describe)\.only\s*\(/;
const ID = /A11Y-EXCEPTION:\s*(A11Y-\d{3})/;
const LOOKBACK = 3;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(ts|tsx|mts|js|mjs)$/.test(entry.name)) yield path;
  }
}

const docIds = new Set(
  [...readFileSync(docPath, 'utf8').matchAll(/^\|\s*(A11Y-\d{3})\s*\|/gm)].map((m) => m[1]),
);
const codeIds = new Map(); // id → first location
const errors = [];

for (const dir of scanDirs) {
  for (const file of walk(join(root, dir))) {
    const rel = relative(root, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const where = `${rel}:${i + 1}`;
      const tagged = line.match(ID);
      if (tagged && !codeIds.has(tagged[1])) codeIds.set(tagged[1], where);

      if (ONLY.test(line))
        errors.push(`${where}  .only is not allowed (it skips every other test)`);

      const marker = MARKERS.find((m) => m.re.test(line));
      if (!marker) return;
      // The closest tag wins (same line first, then upwards).
      let id;
      for (let j = i; j >= Math.max(0, i - LOOKBACK) && !id; j--) id = lines[j].match(ID)?.[1];
      if (!id) {
        errors.push(`${where}  ${marker.what} without an "A11Y-EXCEPTION: A11Y-NNN" comment`);
      } else if (!docIds.has(id)) {
        errors.push(`${where}  ${id} is not declared in docs/a11y-exceptions.md`);
      }
    });
  }
}

for (const id of docIds) {
  if (!codeIds.has(id)) {
    errors.push(`docs/a11y-exceptions.md  ${id} has no marker in the code — fixed? Delete the row`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} a11y exception problem(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error('\nSee docs/a11y-exceptions.md → "How to add one".');
  process.exit(1);
}
console.log(`✓ ${docIds.size} a11y exception(s) declared, all marked in the code.`);
