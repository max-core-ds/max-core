import { build, context } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes('--watch');

const outDir = resolve(here, 'dist');
mkdirSync(outDir, { recursive: true });

const baseOptions = {
  entryPoints: [resolve(here, 'src/code.ts')],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  platform: 'browser',
  outfile: resolve(outDir, 'code.js'),
  logLevel: 'info',
};

function copyStatic() {
  copyFileSync(resolve(here, 'src/ui.html'), resolve(outDir, 'ui.html'));
}

if (watch) {
  const ctx = await context({
    ...baseOptions,
    plugins: [
      {
        name: 'copy-ui',
        setup(b) {
          b.onEnd(() => copyStatic());
        },
      },
    ],
  });
  await ctx.watch();
  console.log('Watching for changes…');
} else {
  await build(baseOptions);
  copyStatic();
  console.log('✓ Built dist/code.js and dist/ui.html');
}
