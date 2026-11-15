import { defineConfig } from 'tsup';

// The `max-core-tokens` bin (cli + generator bundled) and the public type declarations.
// `pnpm build` then runs dist/cli.js to write the stylesheets next to them.
export default defineConfig({
  entry: { cli: 'src/cli.ts', types: 'src/types.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  dts: { entry: { types: 'src/types.ts' } },
  clean: true,
});
