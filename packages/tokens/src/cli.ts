#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTokensCss } from './transform.js';
import type { TokensFile } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, '..');
const sourcePath = resolve(here, 'tokens.json');
const outDir = resolve(packageRoot, 'dist');
const outPath = resolve(outDir, 'tokens.css');

const raw = readFileSync(sourcePath, 'utf8');
const tokens = JSON.parse(raw) as TokensFile;

const css = generateTokensCss(tokens);

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, css, 'utf8');

const variableCount = (css.match(/^\s*--/gm) ?? []).length;
const lightCount = Object.keys(tokens.colors.light).length;
const darkCount = Object.keys(tokens.colors.dark).length;

console.log(`✓ Wrote ${outPath}`);
console.log(`  ${variableCount} variables · ${lightCount} light colors · ${darkCount} dark colors`);
