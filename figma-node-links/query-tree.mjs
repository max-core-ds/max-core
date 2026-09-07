#!/usr/bin/env node
//
// query-tree.mjs — pull a single node subtree without loading a whole page.
//
// Searches the split page files (or figma-tree.json if pages/ is absent) for a node by id
// or by name substring, and prints its subtree to a shallow depth so big pages never land
// whole in context.
//
// Usage: node query-tree.mjs "<nodeId | name substring>" [depth=3]
//   examples:
//     node query-tree.mjs "5:23"           # exact node id
//     node query-tree.mjs "Data table" 2   # name match, 2 levels deep
//
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const needle = process.argv[2];
const maxDepth = Number(process.argv[3] ?? 3);

if (!needle) {
  console.error('usage: node query-tree.mjs "<nodeId|name>" [depth]');
  process.exit(1);
}

const pagesDir = join(here, 'pages');
const sources = existsSync(pagesDir)
  ? readdirSync(pagesDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => join(pagesDir, f))
  : [join(here, 'figma-tree.json')];

const looksLikeId = /^I?\d+[:-]\d+/.test(needle);
const norm = (id) => (id ?? '').replace(/-/g, ':');
const matches = (n) =>
  looksLikeId
    ? norm(n.id) === norm(needle)
    : (n.name ?? '').toLowerCase().includes(needle.toLowerCase());

const found = [];
const find = (n, path) => {
  if (matches(n)) found.push({ node: n, path });
  for (const c of n.children ?? []) find(c, [...path, n.name]);
};

for (const src of sources) {
  find(JSON.parse(readFileSync(src, 'utf8')), []);
  if (found.length && looksLikeId) break; // ids are unique — stop at the first hit
}

if (!found.length) {
  console.error(`no node matched: ${needle}`);
  process.exit(2);
}

const render = (n, depth, indent) => {
  const tag =
    n.type === 'COMPONENT_SET' ? ' [SET]' : n.type === 'COMPONENT' ? ' [cmp]' : '';
  console.log(`${'  '.repeat(indent)}${n.name} · ${n.type}${tag} · ${n.id}`);
  if (depth <= 0) {
    const k = (n.children ?? []).length;
    if (k) console.log(`${'  '.repeat(indent + 1)}… ${k} children (raise depth)`);
    return;
  }
  for (const c of n.children ?? []) render(c, depth - 1, indent + 1);
};

for (const { node, path } of found.slice(0, 8)) {
  console.log(`\n# ${path.filter(Boolean).join(' / ') || '(root)'}`);
  render(node, maxDepth, 0);
}
if (found.length > 8) console.log(`\n… +${found.length - 8} more matches (narrow the query)`);
