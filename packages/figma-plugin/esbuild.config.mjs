import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, context } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes('--watch');
const outDir = resolve(here, 'dist');
mkdirSync(outDir, { recursive: true });

// The plugin carries the published packages' version (lockstep), shown in its UI.
const version = JSON.parse(readFileSync(resolve(here, '../tokens/package.json'), 'utf8')).version;

/** Main thread (Figma sandbox). */
const codeOptions = {
  entryPoints: [resolve(here, 'src/code.ts')],
  bundle: true,
  // Figma's plugin runtime rejects ES2020 syntax (`??`, `?.`); es2017 makes
  // esbuild down-level those to compatible code while keeping async/await.
  format: 'iife',
  target: 'es2017',
  platform: 'browser',
  outfile: resolve(outDir, 'code.js'),
  logLevel: 'info',
};

/** UI iframe: bundled, then inlined into ui.html (a plugin UI must be one HTML file). */
const uiOptions = {
  entryPoints: [resolve(here, 'src/ui.ts')],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  platform: 'browser',
  write: false,
  define: { __PLUGIN_VERSION__: JSON.stringify(version) },
  logLevel: 'info',
};

function writeUi(result) {
  const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const html = readFileSync(resolve(here, 'src/ui.html'), 'utf8');
  if (!html.includes('<!-- UI_SCRIPT -->'))
    throw new Error('src/ui.html lost its <!-- UI_SCRIPT --> marker');
  writeFileSync(
    resolve(outDir, 'ui.html'),
    html.replace('<!-- UI_SCRIPT -->', () => `<script>\n${js}</script>`),
  );
}

if (watch) {
  const code = await context(codeOptions);
  const ui = await context({
    ...uiOptions,
    plugins: [{ name: 'inline-ui', setup: (b) => b.onEnd((r) => r.outputFiles && writeUi(r)) }],
  });
  await Promise.all([code.watch(), ui.watch()]);
  console.log('Watching for changes… (edits to src/ui.html need a restart)');
} else {
  await build(codeOptions);
  writeUi(await build(uiOptions));
  console.log(`✓ Built dist/code.js and dist/ui.html (v${version})`);
}
